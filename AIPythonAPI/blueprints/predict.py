import numpy as np

def predict(model, data, scale=True, n_steps=50):
  # retrieve the last sequence from data
  last_sequence = data["last_sequence"][-n_steps:]
  # expand dimension
  last_sequence = np.expand_dims(last_sequence, axis=0)
  # get the prediction (scaled from 0 to 1)
  prediction = model.predict(last_sequence)
  # get the price (by inverting the scaling)
  if scale:
    predicted_price = data["column_scaler"]["adjclose"].inverse_transform(prediction)[0][0]
  else:
    predicted_price = prediction[0][0]
  return predicted_price
