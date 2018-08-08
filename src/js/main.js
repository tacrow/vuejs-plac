"use strict";

const scroll = new SmoothScroll()

Vue.component('comp-child', {
  // テンプレートで受け取ったvalを使用
  template: '<li>Name: {{ name }}, HP: {{ hp }}</li>',
  // 受け取る属性名を指定
  props: ['name', 'hp']
})

Vue.component('comp-child-event', {
  template: '<div @click="handleClickEmit">クリック</div>',
  methods: {
    handleClickEmit: function() {
      // ボタンをクリックでchilds-eventを発火させる
      this.$emit('childs-event')
    }
  }
})

Vue.component('comp-child-list', {
  // テンプレートで受け取ったvalを使用
  template: '<li>Id: {{ id }}, Name: {{ name }}, HP: {{ hp }}\<button @click="doAttack">HP減</button></li>',
  // 受け取る属性名を指定
  props: {
    id: Number,
    name: String,
    hp: Number
  },
  methods: {
    doAttack: function() {
      this.$emit('attack', this.id)
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    message: '初期メッセージ',
    lists: ['CyberAgent', 'CyberSS', 'CyberOwl'],
    show: false,
    name: 'CyberZ',
    listCyberAgent: [
      { id: 0, name: 'CyberAgent', num: 2000 },
      { id: 1, name: 'AbemaTV', num: 500 },
      { id: 2, name: 'CyberOwl', num: 100 }
    ],
    preview: '',
    val: 50,
    // スクロール関連data
    scrollY: 0,
    timer: null,
    // 算出プロパティ関連data
    width: 800,
    height: 600,
    budget: 500,
    order: false,
    limit: 3,
    listIt: [
      { id: 0, name: 'Microsoft', price: 900 },
      { id: 1, name: 'Apple', price: 1000 },
      { id: 2, name: 'Google', price: 800 },
      { id: 3, name: 'Facebook', price: 700 },
      { id: 4, name: 'Amazon', price: 750 },
    ],
    // watch関連
    list: [],
    current: '',
    topics: [
      { value: '', name: '選択して下さい' },
      { value: 'vue', name: 'Vue.js' },
      { value: 'react', name: 'React.js' },
      { value: 'angular', name: 'Angular' },
      { value: 'backbone', name: 'Backbone.js' },
      { value: 'jQuery', name: 'jQuery' }
    ],
    // valueA: 'これは子A',
    // valueB: 'これは子B'
    complist1: [
      { id: 0, name: 'CyberAgent', hp: 1000 },
      { id: 1, name: 'AbemaTV', hp: 700 },
      { id: 2, name: 'AWA', hp: 500 }
    ],
    complist2: [
      { id: 0, name: 'CyberAgent', hp: 1000 },
      { id: 1, name: 'AbemaTV', hp: 700 },
      { id: 2, name: 'AWA', hp: 500 }
    ]
  },
  created: function() {
    // ハンドラを登録
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy: function() {
    // ハンドラを解除（コンポーネントやSPAの場合は忘れずに！）
    window.removeEventListener('scroll', this.handleScroll)
  },
  // 算出プロパティ
  computed: {
    halfWidth: function() {
      return this.width / 2
    },
    halfHeight: function() {
      return this.height / 2
    },
    halfPoint: function() {
      return {
        x: this.halfWidth,
        y: this.halfHeight
      }
    },
    halfWidthGetSet: {
      get: function() { return this.width / 2 },
      set: function(val) { this.width = val * 2 }
    },
    // computedData: function() { return Math.random() },
    // budget以下のリストを返す算出プロパティ
    matched: function() {
      return this.listIt.filter((el) => {
        return el.price <= this.budget
      }, this)
    },
    // sorted
    sorted: function() {
      return _.orderBy(this.matched, 'price', this.order ? 'desc' : 'asc')
    },
    // matchedで返ったデータをlimit件返す算出プロパティ
    limited: function() {
      return this.sorted.slice(0, this.limit)
    },
    filteredList: function() {
      return this.limited // 変更があればテンプレートではなくこちらを修正
    }
  },
  // メソッド
  methods: {
    handleClick: (e) => {
      console.log('click!');
    },
    addCompany: function() {
      const max = this.listCyberAgent.reduce((x, y) => {
        return x > y.id ? x : y.id
      }, 0)
      this.listCyberAgent.push({
        id: max + 1,
        name: this.name,
        num: 100
      })
    },
    removeCompany: function(index) {
      this.listCyberAgent.splice(index, 1)
    },
    handleChangeImage: function(event) {
      let file = event.target.files[0]
      if(file && file.type.match(/^image\/(png|jpeg)$/)) {
        this.preview = window.URL.createObjectURL(file)
      }
    },
    // v-on以外のイベント
    // 違和感のない程度に200ms感覚でscrollデータを更新する例
    handleScroll: function() {
      if(this.timer == null) {
        this.timer = setTimeout(function()　{
          this.scrollY = window.scrollY
          clearTimeout(this.timer)
          this.timer = null
        }.bind(this), 200)
      }
    },
    // ページTOPへ移動
    scrollTop: function() {
      scroll.animateScroll(0)
    },
    // methodsData: function() { return Math.random() }

    // 子からのイベントが発生
    parentMethod: function() {
      console.log('子からのイベントを検知')
    },

    handleAttack: function(id) {
      const item = this.complist2.find((el) => {
        return el.id === id
      })
      if(item !== undefined && item.hp > 0) item.hp -= 10
    }
  },
  // ワッチ
  watch: {
    current: function(val) {
      // GithubのAPIからトピックのリポジトリを検索
      axios.get('https://api.github.com/search/repositories', {
        params: {
          q: 'topic:' + val
        }
      }).then(function(response) {
        this.list = response.data.items
      }.bind(this))
    },
    list: function() {
      // DOM更新後にulの高さは取得できない
      console.log('通常: ', this.$refs.list.offsetHeight)

      // nextTickを利用すると、DOM更新後のulの高さが取得できる
      this.$nextTick(function() {
        console.log('通常: ', this.$refs.list.offsetHeight)
      })
    }
  }
})