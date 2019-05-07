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
    },
    doHyperOpt: async values => {
      try {
        let job = (await axios.post("http://127.0.0.1:5000/hyperopt", values))
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
    doPaperTrading: async values => {
      try {
        await axios.post("http://127.0.0.1:5000/papertrading", values);
        notif(
          "success",
          "Paper Trading",
          `Spawned new terminal for paper trading.`
        );
      } catch (e) {
        console.log(e);
        notif("error", "Spawning Terminal Failed");
      }
    },
    login: async values => {
      try {
        let { user } = (await axios.post(
          "http://127.0.0.1:5000/login",
          values
        )).data;
        notif("success", "Login", `Login Successfull`);
        changeProps({ user });
      } catch (e) {
        console.log(e);
        notif("error", "Login Failed");
      }
    },
    setup: async values => {
      try {
        let { user } = (await axios.post(
          "http://127.0.0.1:5000/setup",
          values
        )).data;
        notif("success", "Setup", `Setup Successfull`);
        changeProps({ user });
      } catch (e) {
        console.log(e);
        notif("error", "Setup Failed");
      }
    },
    getCoins: async values => {
      try {
        let { coins, userCoins } = (await axios.post(
          "http://127.0.0.1:5000/coins",
          values
        )).data;
        // notif("success", "Login", `Login Successfull`);
        changeProps({ coins, userCoins });
      } catch (e) {
        console.log(e);
        // notif("error", "Login Failed");
      }
    },
    setCoins: async values => {
      try {
        let { userCoins } = (await axios.post(
          "http://127.0.0.1:5000/add_coins",
          values
        )).data;
        notif("success", "Modified Profile", `Updated Tracked Coins`);
        changeProps({ userCoins });
      } catch (e) {
        console.log(e);
        notif("error", "Updating Tracked Coins failed.");
      }
    }
  };
};
