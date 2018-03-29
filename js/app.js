;(function (Vue){
	Vue.config.devtools = true;
	var todos = window.localStorage.getItem('todos') || [];

	window.VueApp = new Vue({
		el: '#todoapp',
		data: {
			todos:JSON.parse(window.localStorage.getItem('todos') || '[]' ),
			filterStat:'all',
			itemEditing:null
		},
		methods: {
			addTodo (event) {
				var addTodoText = event.target.value.trim();
				if(!addTodoText){
					return;
				};
				var arrTodoId = this.todos[this.todos.length-1];
				var id = arrTodoId ? arrTodoId.id + 1 : 1;
				this.todos.push({
					id,
					itemName:addTodoText,
					completed:false
				});
				event.target.value='';
			},

			removeTodo (delIndex,event) {
				this.todos.splice(delIndex,1);
			},

			removeAllDone () {
				//通过 filter 过滤掉以完成任务
				this.todos = this.todos.filter(item => !item.completed);
				// for(let i=0;i<this.todos.length;i++){
				// 	if(this.todos[i].completed){
				// 		this.todos.splice(i,1);
				// 		i--;
				// 	}
				// };
			},

			resItemEditing (item,index,e) {
				var itemText = e.target.value.trim();
				if(!itemText.length){
					return this.todos.splice(index,1);
				};
				item.itemName = itemText;
				this.itemEditing = null;
			}
		},
		//利用计算属性显示未完成数量，增加运行效率，跟data中的属性一样使用,需要返回数据的时候使用计算属性
		computed: {
			getLeftItem () {
				return this.todos.filter(item => !item.completed).length;
			},
			filterTodos () {
				switch (this.filterStat) {
					case 'active':
						return this.todos.filter(item => !item.completed);
						break;
					case 'completed':
						return this.todos.filter(item => item.completed);
						break;
					default:
						return this.todos;
						break;
				}
			},
			//利用计算属性的双向绑定完成 toggle-all 选择与未选择
			toggleSelect: {
				get () {
					return this.todos.every(item => item.completed);
				},
				set (val) {
					this.todos.forEach(todos => todos.completed = val);
				}
			}
		},
		//自定义指令的使用 directive
		directives: {
			focus: {
				inserted (el) {
					el.focus();
				}
			},
			editingFocus:{
				update (el,binding) {
					if(binding.value){
						el.focus();
					}
				}
			}
		},
		//Vue 自动监听 data 的数据更新，并可以自定义添加需要的执行的功能
		watch: {
			todos: {
				//使用本地存储把任务进行持久化
				handler (val,oldVal) {
					window.localStorage.setItem('todos',JSON.stringify(this.todos));
				},
				deep:true
			}
		}
	});

	window.onhashchange = function () {
		var hashText = window.location.hash.substr(2) || 'all';
		if(hashText != 'all' && hashText != 'active' && hashText != 'completed') return;
		window.VueApp.filterStat = hashText;
	};

	window.onhashchange();
})(Vue);
