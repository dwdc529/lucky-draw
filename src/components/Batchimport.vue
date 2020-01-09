<template>
  <el-dialog :visible="visible" :append-to-body="true" width="785px" @close="$emit('update:visible', false)"
    class="c-Importphoto" :lock-scroll="false">
    <el-row>
      <label for="idinput">照片选择</label>
      <span class="selectbg" :data-tip="selectTip">
        <input ref="uploadinput" class="upload" type="file" accept=".jpg,.png" @change="inputChange" multiple />
      </span>
    </el-row>
    <el-row class="photo">
      <label>已选照片</label> 共 <i style="color: red;">{{ images.length }}</i> 张
      <ul v-if="images">
        <li v-for="value in images" :key="value.source">
          <img :src="value.source" alt="img" :width="40" :height="40" />
        </li>
      </ul>
      <span v-else>暂未选择</span>
    </el-row>
    <!-- <el-row>
      支持jpg和png，照片大小不能超过150kb,建议20-50kb，建议尺寸为160*160px
    </el-row> -->
    <el-row class="center">
      <el-button size="mini" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="mini" type="warning" @click="randomSort">重排</el-button>
      <el-button size="mini" type="primary" @click="saveHandler">保存</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
  import { database, DB_STORE_NAME } from '@/helper/db';
  import { getRepeatNum, shuffle, loadImages } from '@/helper/algorithm';

  export default {
    name: 'Batchimport',
    props: {
      visible: Boolean
    },
    computed: {
      config: {
        get() {
          return this.$store.state.config;
        }
      }
    },
    data() {
      return {
        files: [],
        images: [],
        selectTip: '点击选择照片'
      };
    },
    methods: {
      inputChange(e) {
        const _files = [];
        const fileList = e.target.files;

        for (let i = 0; i < fileList.length; i++) {
          _files.push(fileList[i]);
        }

        const errExtName = Object.values(_files).filter(f => {
          const extName = f.name.substring(f.name.lastIndexOf('.') + 1);
          return !extName || ['PNG', 'JPG'].indexOf(extName.toUpperCase()) < 0;
        });

        if (errExtName.length) {
          return this.$message.error('您所选的文件包含不支持的文件格式');
        }

        const AllowImgFileSize = 1024 * 150;
        const errSize = _files.every(file => AllowImgFileSize < file.size);
        if (errSize.length) {
          return this.$message.error('不允许上传大于150KB的图片');
        }

        this.files = _files;

        this.randomSort();
      },
      randomSort() {
        shuffle(this.files);

        const mapData = this.files.map(m => m.name.split('-')[0]);

        const departmentCount = getRepeatNum(mapData);

        // console.log('mapData', mapData);
        console.log('部门人数：', departmentCount);

        this.$store.commit('setDepartment', departmentCount);

        loadImages(this.files).then(result => this.images = result);
      },
      async saveHandler() {

        const items = this.images.map((m, i) => ({
          id: i + 1,
          value: m.source,
          name: m.filename ? m.filename.replace(/(.*\/)*([^.]+).*/ig, "$2") : ''
        }));

        const peopleNum = items.map(m => ({ id: m.id, name: m.name }));

        console.log('人员编号：', peopleNum);

        this.$store.commit('setPeopleNum', peopleNum);

        database['addMultiple'](DB_STORE_NAME, items)
          .then(res => {
            if (res) {
              this.$refs.uploadinput.value = '';
              this.images = [];
              this.$emit('update:visible', false);
              this.$emit('getPhoto');
              this.$message({ message: '保存成功', type: 'success' });
            } else {
              this.$message.error('保存失败');
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    }
  };
</script>
<style type="text/css">
  .c-Importphoto .el-dialog {
    height: auto;
  }

  .c-Importphoto label {
    margin-right: 20px;
    vertical-align: top;
  }

  .c-Importphoto .el-input {
    width: 140px;
  }

  .c-Importphoto .el-row {
    padding: 5px 0;
  }

  .c-Importphoto .center {
    text-align: center;
  }

  .c-Importphoto .selectbg {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 2px;
    width: 140px;
    height: 28px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
  }

  .c-Importphoto .selectbg::before {
    content: attr(data-tip);
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 28px;
    cursor: pointer;
    overflow: hidden;
    font-size: 12px;
  }

  .c-Importphoto .selectbg .upload {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }

  .c-Importphoto .photo ul {
    margin-top: 10px;
    padding: 10px;
    min-height: 20vh;
    max-height: 40vh;
    overflow-y: auto;
    background: #f7f7f7;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
  }

  .c-Importphoto .photo ul li {
    margin: 5px;
    padding: 4px;
    border: 1px solid #ccc;
  }

  .c-Importphoto .photo img {
    /* border: 1px solid #ccc;
	 */
    border: none;
  }

  .c-Importphoto .photo span {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 2px;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
  }
</style>