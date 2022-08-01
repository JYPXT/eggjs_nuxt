<template>
  <section class="cr-search-panel">
    <input
      ref="crInput"
      v-model="condition.text"
      type="text"
      autocomplete="off"
      placeholder="搜索"
      @blur="visible = false"
      @focus="crInputFocus"
      @input="crInput"
      clear
    />
    <i
      v-show="!visible"
      class="cr-search-panel-icon el-icon-search"
      @click.self="selectClick"
    ></i>
    <el-collapse-transition>
      <div
        v-show="visible"
        class="cr-search-panel-container"
        :class="conClass"
        @mousedown.prevent
        @click.prevent.capture
      >
        <el-scrollbar class="scrollbar">
          <ul
            v-infinite-scroll="nextPage"
            class="cr-search-panel-content"
            :infinite-scroll-disabled="disabled"
            :infinite-scroll-immediate="false"
          >
            <li
              v-for="item in lists"
              :key="item._id"
              class="cr-search-panel-item"
            >
              <div class="cr-search-panel-title">
                {{ item.crumbs }}
              </div>
              <div class="cr-search-panel-context" :title="item.content">
                <div class="cr-search-panel-descript" @click="toPage(item)">
                  <template v-for="(content, $index) in item.contents">
                    <span v-if="content.color" :key="$index" class="md-match">{{
                      content.text
                    }}</span>
                    <template v-else>{{ content.text }}</template>
                  </template>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-collapse-transition>
  </section>
</template>
<script>
// 这是一个页面，不是组件 =-=
export default {
  name: "SearchPanel",
  props: {
    category: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      condition: {
        text: "",
        pageindex: 0,
        pagesize: 10,
        category: this.category,
      },
      visible: false,
      // currentValue: "",
      conClass: "",
      timer: null,
      disabled: false,
      lists: [],
    };
  },
  // watch: {
  //   value: {
  //     handler: "setCurrentValue",
  //     immediate: true,
  //   },
  // },
  methods: {
    input(e) {
      const { value } = e.target;
      this.currentValue = value;
      this.$emit("input", value);
    },
    setCurrentValue(n, o) {
      if (n !== o) {
        this.currentValue = n;
      }
    },
    crInput() {
      this.timer && clearTimeout(this.timer);
      if (this.condition.text) {
        this.timer = setTimeout(() => {
          this.visible = true;
          this.condition.pageindex = 0;
          this.load();
        }, 200);
      } else {
        this.visible = false;
        this.condition.pageindex = 0;
        this.lists = [];
      }
    },
    crInputFocus() {
      if (this.lists.length > 0) {
        this.visible = true;
      }
    },
    nextPage() {
      this.condition.pageindex++;
      this.load();
    },
    async load() {
      if (this.disabled) return;
      this.disabled = true;
      const { condition } = this;
      condition.text = condition.text.replace(/^\s+|\s+$/g, "");
      const platform = this.$route.query.platform;
      let data = await this.$apis.searchDocument(condition, platform);
      this.disabled = false;
      if (condition.text) {
        const regText = condition.text.split(" ").join("|").toString();
        // const reg = new RegExp(`([${regText}]+)`, "g");
        const reg = new RegExp(`(${regText})+`, "g");
        data = data.map((item) => {
          const textContent = [];
          const text = item.content;
          let prevIdx = 0;
          text.replace(reg, (str, match, idx) => {
            const len = match.length;
            textContent.push(
              {
                text: text.substring(prevIdx, idx),
                color: false,
              },
              {
                text: match,
                color: true,
              }
            );
            prevIdx = idx + len;
            return match;
          });
          if (prevIdx !== text.length) {
            const lastText = text.substr(prevIdx, text.length - prevIdx);
            textContent.push({
              text: lastText,
              color: false,
            });
          }
          item.contents = textContent;
          return item;
        });
      }
      this.lists = condition.pageindex === 0 ? data : this.lists.concat(data);
    },
    async selectClick() {
      // const text = this.condition.text.replace(/^\s+|\s+$/g, "");
      // if (text) {}
      const crInput = this.$refs.crInput;
      this.condition.pageindex = 0;
      crInput.focus();
    },
    toPage(item) {
      this.$refs.crInput.blur();
      this.$emit("searchPosition", item);
    },
  },
};
</script>

<style lang="postcss" scoped>
.cr-search-panel {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  input {
    display: inline-block;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    width: 100%;
    z-index: 199;
    -webkit-appearance: none;
    outline: 0;
    &::placeholder {
      color: #c0c4cc;
    }
    &:focus {
      border-color: #409eff;
    }
  }

  &-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: auto;
    cursor: pointer;
  }

  &-container {
    position: absolute;
    left: 0px;
    width: 100%;
    /* height: 300px; */
    height: 500px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-sizing: border-box;
    text-align: left;

    &.top {
      top: 38px;
    }
    &.bottom {
      bottom: 38px;
    }
    & ::v-deep .cr-org-tree {
      position: relative;
      min-height: 100%;
    }
  }

  &-item {
    box-sizing: border-box;
    padding: 0 10px;
    & + .cr-search-panel-item {
      border-top: 6px solid #f3f3f3;
    }
  }

  &-title {
    font-size: 18px;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin-bottom: 14px;
    margin-top: 20px;
  }

  &-context {
    border-top: 1px solid #e3e3ec;
    padding: 15px 0;
  }

  &-descript {
    font-size: 14px;
    font-weight: 400;
    color: #586376;
    line-height: 24px;
    display: block;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    cursor: pointer;
  }
}
</style>
