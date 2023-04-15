import numpy as np

def get_final_df(model, data, scale=True, lookup_step=1):
  """
  This function takes the `model` and `data` dict to 
  construct a final dataframe that includes the features along 
  with true and predicted prices of the testing dataset
  """

  # if predicted future price is higher than the current, 
  # then calculate the true future price minus the current price, to get the buy profit
  buy_profit  = lambda current, pred_future, true_future: true_future - current if pred_future > current else 0

# if the predicted future price is lower than the current price,
  # then subtract the true future price from the current price
  sell_profit = lambda current, pred_future, true_future: current - true_future if pred_future < current else 0
  X_test = data["X_test"]
  y_test = data["y_test"]
  
  # perform prediction and get prices
  y_pred = model.predict(X_test)
  
  if scale:
    y_test = np.squeeze(data["column_scaler"]["adjclose"].inverse_transform(np.expand_dims(y_test, axis=0)))
    y_pred = np.squeeze(data["column_scaler"]["adjclose"].inverse_transform(y_pred))
  
  test_df = data["test_df"]
  
  # add predicted future prices to the dataframe
  test_df[f"adjclose_{lookup_step}"] = y_pred
  
  # add true future prices to the dataframe
  test_df[f"true_adjclose_{lookup_step}"] = y_test
  
  # sort the dataframe by date
  test_df.sort_index(inplace=True)
  final_df = test_df

  # add the buy profit column
  # since we don't have profit for last sequence, add 0's
  final_df["buy_profit"] = list(map(buy_profit, final_df["adjclose"], final_df[f"adjclose_{lookup_step}"], final_df[f"true_adjclose_{lookup_step}"]))

  # add the sell profit column
  # since we don't have profit for last sequence, add 0's
  final_df["sell_profit"] = list(map(sell_profit, final_df["adjclose"], final_df[f"adjclose_{lookup_step}"], final_df[f"true_adjclose_{lookup_step}"]))
  
  return final_df
