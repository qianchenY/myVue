class myVue{
    constructor(option){
        // option参数深复制 有bug
        this.option = option;
        for(let key in option){
            this[key] = JSON.parse(JSON.stringify(option[key]));
        }
        this.init();
    }
    init(){
        // 初始化
        this.listenData();
        this.compile("init");
        this.listenEvent();
    }
    listenData(){
        // 为data对象配置get和set方法
        let _this = this;
        console.log(_this.data);
        for(let key in _this.data){
            Object.defineProperty(_this.data, key,{
                configurable: true,
                enumerable: true,
                get(){
                    return _this.option.data[key];
                },
                set(v){
                    _this.compile("updata", key, v);
                }
            })
        }
        
    }
    compile(type, key, val){
        // 编译模板，实现数据双向绑定
        if(!this.child){
            let el = document.getElementById(this.el);
            this.child = el.getElementsByTagName("*");
        }
        for(let i = 0; i < this.child.length; i++){
            let elc = this.child[i];
            switch(type){
                case "init":
                    // 元素设置默认值，并为其添加监听事件
                    (()=>{
                        if(elc.hasAttribute("v-modal")){
                            var name = elc.getAttribute("v-modal");
                            elc.setAttribute("value", this.data[name]);
                            elc.addEventListener("input", (e)=>{
                                this.data[name] = e.target.value;
                            })
                        }
                    })()
                    break;
                case "updata":
                    // data值更改时，修改对应元素值
                    (()=>{
                        if(elc.hasAttribute("v-modal") && elc.getAttribute("v-modal") == key){
                            elc.setAttribute("value", val)
                        }
                    })()
                    break;
            }
        }
    }
    listenEvent(){
        // 获取元素绑定事件，并为事件添加对应函数
        for(let i = 0; i < this.child.length; i++){
            let elc = this.child[i],
                elcAttr = elc.attributes;
            for(let i = 0; i < elcAttr.length; i++){
                if(elcAttr[i].nodeName.search("v-on") >= 0){
                    var eventName = elcAttr[i].nodeName.split(":")[1],
                        funcName = elcAttr[i].nodeValue;
                    elc.addEventListener(eventName, (e)=>{
                        this.option.methods[funcName].call(this, e);
                    })
                }
            }
        }
    }
}