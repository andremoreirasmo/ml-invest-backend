import os
import random

import numpy as np
import pandas as pd

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from yahoo_fin import stock_info as si
from collections import deque

from flask import Flask, jsonify, request

# set seed, so we can get the same results after rerunning several times
np.random.seed(314)
tf.random.set_seed(314)
random.seed(314)

def shuffle_in_unison(a, b):
  # shuffle two arrays in the same way
  state = np.random.get_state()
  np.random.shuffle(a)
  np.random.set_state(state)
  np.random.shuffle(b)

def load_data(ticker, n_steps=50, scale=True, shuffle=False, lookup_step=1, split_by_date=True, test_size=0.2, feature_columns=['adjclose', 'volume', 'open', 'high', 'low']):
  """
  Loads data from Yahoo Finance source, as well as scaling, shuffling, normalizing and splitting.
  Params:
    ticker (str/pd.DataFrame): the ticker you want to load, examples include AAPL, TESL, etc.
    n_steps (int): the historical sequence length (i.e window size) used to predict, default is 50
    scale (bool): whether to scale prices from 0 to 1, default is True
    shuffle (bool): whether to shuffle the dataset (both training & testing), default is True
    lookup_step (int): the future lookup step to predict, default is 1 (e.g next day)
    split_by_date (bool): whether we split the dataset into training/testing by date, setting it 
      to False will split datasets in a random way
    test_size (float): ratio for test data, default is 0.2 (20% testing data)
    feature_columns (list): the list of features to use to feed into the model, default is everything grabbed from yahoo_fin
  """
  # see if ticker is already a loaded stock from yahoo finance
  if isinstance(ticker, str):
    # load it from yahoo_fin library
    df = si.get_data(ticker)
  elif isinstance(ticker, pd.DataFrame):
    # already loaded, use it directly
    df = ticker
  else:
    raise TypeError("ticker can be either a str or a `pd.DataFrame` instances")
  # this will contain all the elements we want to return from this function
  result = {}
  # we will also return the original dataframe itself
  result['df'] = df.copy()
  # make sure that the passed feature_columns exist in the dataframe
  for col in feature_columns:
    assert col in df.columns, f"'{col}' does not exist in the dataframe."
  # add date as a column
  if "date" not in df.columns:
    df["date"] = df.index
  if scale:
    column_scaler = {}
    # scale the data (prices) from 0 to 1
    for column in feature_columns:
      scaler = preprocessing.MinMaxScaler()
      df[column] = scaler.fit_transform(np.expand_dims(df[column].values, axis=1))
      column_scaler[column] = scaler
    # add the MinMaxScaler instances to the result returned
    result["column_scaler"] = column_scaler
  # add the target column (label) by shifting by `lookup_step`
  df['future'] = df['adjclose'].shift(-lookup_step)
  # last `lookup_step` columns contains NaN in future column
  # get them before droping NaNs
  last_sequence = np.array(df[feature_columns].tail(lookup_step))
  # drop NaNs
  df.dropna(inplace=True)
  sequence_data = []
  sequences = deque(maxlen=n_steps)
  for entry, target in zip(df[feature_columns + ["date"]].values, df['future'].values):
    sequences.append(entry)
    if len(sequences) == n_steps:
      sequence_data.append([np.array(sequences), target])
  # get the last sequence by appending the last `n_step` sequence with `lookup_step` sequence
  # for instance, if n_steps=50 and lookup_step=10, last_sequence should be of 60 (that is 50+10) length
  # this last_sequence will be used to predict future stock prices that are not available in the dataset
  last_sequence = list([s[:len(feature_columns)] for s in sequences]) + list(last_sequence)
  last_sequence = np.array(last_sequence).astype(np.float32)
  # add to result
  result['last_sequence'] = last_sequence 
  return result

def create_model(sequence_length, n_features, units=256, cell=LSTM, n_layers=2, dropout=0.3, loss="mean_absolute_error", optimizer="rmsprop", bidirectional=False):
  model = Sequential()
  for i in range(n_layers):
    if i == 0:
      # first layer
      if bidirectional:
        model.add(Bidirectional(cell(units, return_sequences=True), batch_input_shape=(None, sequence_length, n_features)))
      else:
        model.add(cell(units, return_sequences=True, batch_input_shape=(None, sequence_length, n_features)))
    elif i == n_layers - 1:
      # last layer
      if bidirectional:
        model.add(Bidirectional(cell(units, return_sequences=False)))
      else:
        model.add(cell(units, return_sequences=False))
    else:
      # hidden layers
      if bidirectional:
        model.add(Bidirectional(cell(units, return_sequences=True)))
      else:
        model.add(cell(units, return_sequences=True))
    # add dropout after each layer
    model.add(Dropout(dropout))
  model.add(Dense(1, activation="linear"))
  return model

# Window size or the sequence length
N_STEPS = 50
# Lookup step, 1 is the next day
LOOKUP_STEP = 1
# whether to scale feature columns & output price as well
SCALE = True
scale_str = f"sc-{int(SCALE)}"
# whether to shuffle the dataset
SHUFFLE = True
shuffle_str = f"sh-{int(SHUFFLE)}"
# whether to split the training/testing set by date
SPLIT_BY_DATE = True
split_by_date_str = f"sbd-{int(SPLIT_BY_DATE)}"
# test ratio size, 0.2 is 20%
TEST_SIZE = 0.2
# features to use
FEATURE_COLUMNS = ["adjclose", "volume", "open", "high", "low"]
### model parameters
N_LAYERS = 2
# LSTM cell
CELL = LSTM
# 256 LSTM neurons
UNITS = 256
# 40% dropout
DROPOUT = 0.4
# whether to use bidirectional RNNs
BIDIRECTIONAL = False
### training parameters
# mean absolute error loss
# LOSS = "mae"
# huber loss
LOSS = "huber_loss"
OPTIMIZER = "adam"
BATCH_SIZE = 64
EPOCHS = 500

# create these folders if they does not exist
if not os.path.isdir("archives"):
  os.mkdir("archives")
if not os.path.isdir("archives/results"):
  os.mkdir("archives/results")

def predict(model, data):
  # retrieve the last sequence from data
  last_sequence = data["last_sequence"][-N_STEPS:]
  # expand dimension
  last_sequence = np.expand_dims(last_sequence, axis=0)
  # get the prediction (scaled from 0 to 1)
  prediction = model.predict(last_sequence)
  # get the price (by inverting the scaling)
  if SCALE:
    predicted_price = data["column_scaler"]["adjclose"].inverse_transform(prediction)[0][0]
  else:
    predicted_price = prediction[0][0]
  return predicted_price

# Run API
app = Flask(__name__)

@app.route('/metrics', methods = ['GET'])
def price_future():
  ticker = request.args.get('ticker')
  
  # Carrega o modelo
  model_path = os.path.join("archives/results", ticker) + ".h5"
  model = create_model(N_STEPS, len(FEATURE_COLUMNS), loss=LOSS, units=UNITS, cell=CELL, n_layers=N_LAYERS, dropout=DROPOUT, optimizer=OPTIMIZER, bidirectional=BIDIRECTIONAL)
  model.load_weights(model_path)

  data_ticker = load_data(ticker, n_steps=N_STEPS, split_by_date=SPLIT_BY_DATE, lookup_step=LOOKUP_STEP)  

  future_price = float(predict(model, data_ticker))  

  return jsonify({
    'future_price' : future_price    
  })
