import { notification } from "antd";
import axios from "axios";

const notif = (type, message = "", description = "") => {
  notification[type]({ message, description });
};

let oldTasks = undefined;

export default (dispatch, ACTION_TYPES) => {
  let changeProps = payload => {
    return dispatch({ type: ACTION_TYPES.CHANGE_PROPS, payload });
  };
  return {
    getTasks: async () => {
      try {
        let tasks = (await axios.get("http://127.0.0.1:5000/tasks")).data;
        if (JSON.stringify(tasks) !== JSON.stringify(oldTasks)) {
          oldTasks = tasks;
          changeProps({ tasks });
        }
      } catch (e) {
        console.log(e);

        if (oldTasks !== undefined) {
          oldTasks = undefined;
          changeProps({ tasks: undefined });
        }
      }
    },
    getFilenames: async () => {
      try {
        let filenames = (await axios.get("http://127.0.0.1:5000/filenames"))
          .data;
        changeProps({ filenames });
      } catch (e) {
        console.log(e);
        changeProps({ filenames: [] });
      }
    },
    getStrategies: async () => {
      try {
        let { data } = await axios.get("http://127.0.0.1:5000/strategies");
        let [strategies, configs, hypers] = data;
        changeProps({ strategies, configs, hypers });
      } catch (e) {
        console.log(e);
        changeProps({ strategies: [] });
      }
    },
    downloadDataset: async values => {
      try {
        let job = (await axios.post("http://127.0.0.1:5000/dataset", values))
          .data;
        notif(
          "success",
          "Queued",
          `Download Dataset is Queued as job ${job.id}`
        );
      } catch (e) {
        console.log(e);
        notif("error", "Queuing Failed");
      }
    },
    doBacktest: async values => {
      try {
        let backtest = (await axios.post(
          "http://127.0.0.1:5000/backtest",
          values
        )).data;
        notif("success", "Success", `Backtest is successful`);
        changeProps({ backtest });
      } catch (e) {
        console.log(e);
        notif("error", "Backtest Failed");
      }
    }
  };
};
