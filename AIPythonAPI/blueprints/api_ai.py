import os
from tensorflow.python.client import device_lib
from tensorflow.keras.layers import LSTM
from flask import jsonify, request

from .create_model import create_model
from .predict import predict
from .data_training import load_data
from .data_frame_final import get_final_df

device_lib.list_local_devices()

# Window size or the sequence length
N_STEPS = 50
# Lookup step, 1 is the next day
LOOKUP_STEP = 1
# whether to scale feature columns & output price as well
SCALE = True
# whether to split the training/testing set by date
SPLIT_BY_DATE = False

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

# mean absolute error loss
# LOSS = "mae"
# huber loss
LOSS = "huber_loss"
OPTIMIZER = "adam"

# create these folders if they does not exist
if not os.path.isdir("../archives/"):
  os.mkdir("../archives/")
if not os.path.isdir("../archives/results"):
  os.mkdir("../archives/results")

model = create_model(N_STEPS, len(FEATURE_COLUMNS), loss=LOSS, units=UNITS, cell=CELL, n_layers=N_LAYERS, dropout=DROPOUT, optimizer=OPTIMIZER, bidirectional=BIDIRECTIONAL)

def init_app(app):
  @app.route('/metrics', methods = ['GET'])
  def price_future():
    ticker = request.args.get('ticker')
    date = request.args.get('date')
    model_ticker = ticker + '_' + date
  
    # Carrega o modelo
    model_path = os.path.join("../archives/results", model_ticker) + ".h5"
    model.load_weights(model_path)

    data_ticker = load_data(ticker, n_steps=N_STEPS, split_by_date=SPLIT_BY_DATE, lookup_step=LOOKUP_STEP)
    final_data = get_final_df(model, data_ticker, scale=SCALE, lookup_step=LOOKUP_STEP)

    future_price = float(predict(model, data_ticker, scale=SCALE, n_steps=N_STEPS))
    accuracy_score = float((len(final_data[final_data['sell_profit'] > 0]) + len(final_data[final_data['buy_profit'] > 0])) / len(final_data))
    total_buy_profit  = float(final_data["buy_profit"].sum())
    total_sell_profit = float(final_data["sell_profit"].sum())
    total_profit = float(total_buy_profit + total_sell_profit)
    profit_per_trade = float(total_profit / len(final_data))

    return jsonify({
      'future_price' : future_price,
      'number_days' : LOOKUP_STEP,
      'accuracy' : accuracy_score,
      'buy_profit' : total_buy_profit,
      'sell_profit' : total_sell_profit,
      'total_profit' : total_profit,
      'profit_trade' : profit_per_trade
    })
