import Vue from 'vue';
import Vuex from 'vuex';
import {
  setData,
  resultField,
  newLotteryField,
  listField
} from '@/helper/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      name: '深圳市晶泓科技有限公司2020年会抽奖程序',
      number: 174,
      specialAward: 2,
      firstPrize: 3,
      secondPrize: 5,
      thirdPrize: 10,
      fourthPrize: 0,
      fifthPrize: 0
    },
    result: {
      specialAward: [],
      firstPrize: [],
      secondPrize: [],
      thirdPrize: [],
      fourthPrize: [],
      fifthPrize: []
    },
    newLottery: [],
    list: [],
    photos: []
  },
  mutations: {
    setClearConfig(state) {
      state.config = {
        name: '深圳市晶泓科技有限公司2020年会抽奖程序',
        number: 174,
        specialAward: 2,
        firstPrize: 3,
        secondPrize: 5,
        thirdPrize: 10,
        fourthPrize: 0,
        fifthPrize: 0
      };
      state.newLottery = [];
    },
    setClearList(state) {
      state.list = [];
    },
    setClearPhotos(state) {
      state.photos = [];
    },
    setClearResult(state) {
      state.result = {
        specialAward: [],
        firstPrize: [],
        secondPrize: [],
        thirdPrize: [],
        fourthPrize: [],
        fifthPrize: []
      };
    },
    setClearStore(state) {
      state.config = {
        name: '深圳市晶泓科技有限公司2020年会抽奖程序',
        number: 174,
        specialAward: 2,
        firstPrize: 3,
        secondPrize: 5,
        thirdPrize: 10,
        fourthPrize: 0,
        fifthPrize: 0
      };
      state.result = {
        specialAward: [],
        firstPrize: [],
        secondPrize: [],
        thirdPrize: [],
        fourthPrize: [],
        fifthPrize: []
      };
      state.newLottery = [];
      state.list = [];
      state.photos = [];
    },
    setConfig(state, config) {
      state.config = config;
    },
    setResult(state, result = {}) {
      state.result = result;

      setData(resultField, state.result);
    },
    setNewLottery(state, newLottery) {
      if (state.newLottery.find(item => item.name === newLottery.name)) {
        return;
      }
      state.newLottery.push(newLottery);
      setData(newLotteryField, state.newLottery);
    },
    setDepartment(state, departmentCount) {
      setData('departmentCount', departmentCount);
    },
    setPeopleNum(state, peopleNum) {
      setData('peopleNum', peopleNum);
    },
    setList(state, list) {
      const arr = state.list;
      list.forEach(item => {
        const arrIndex = arr.findIndex(data => data.key === item.key);
        if (arrIndex > -1) {
          arr[arrIndex].name = item.name;
        } else {
          arr.push(item);
        }
      });
      state.list = arr;

      setData(listField, arr);
    },
    setPhotos(state, photos) {
      // console.log('photos', photos);
      state.photos = photos;
    }
  },
  actions: {},
  modules: {}
});
