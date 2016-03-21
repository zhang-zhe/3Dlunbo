/*----------由于浏览器存在兼容新问题，所以写出以下函数以解决，同时方便实现常用功能---------*/

/*以下的选择环境时候，书写不能把context与document写反，否则当context传入，也只会返回document，这会导致传入环境没用*/

/*----------ie8及以下浏览器无法使用getElementsByClassName，所以需要写一个函数兼容------*/
//getClass获取指定类名，selector  要获取的类名， [context] （指定的区间）上下文环境
function getClass(selector,context) {
	var obj=context||document;
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(selector);
	}else{
		var alls=obj.getElementsByTagName("*");
		var arr=[];
		for(var i=0;i<alls.length;i++){
			if(check(selector,alls[i].className)){
				arr.push(alls[i]);
			}	
		}
		return arr;
	}
}
//找的类名，class1和原有类名class2
function check(class1,class2) {
	var arr=class2.split(" ");
	for(var i=0;i<arr.length;i++){
		if(class1==arr[i]){
			return true;
		}
	}
	return false;
}
/*-------------------$() 通过CSS选择器获取指定的元素----------------*/
//selector  通过CSS选择器获取指定的元素
//obj	查找范围
function $(selector,context){
	var obj=context||document;
	if(typeof selector=="string"){
		var selector=trim(selector);
		if(selector.charAt(0)=="."){
			return getClass(selector.substr(1),obj);
		}else if(selector.charAt(0)=="#"){
			return document.getElementById(selector.substr(1));
		}else if(/^[a-z][a-z1-6]{0,10}$/.test(selector)){
			return obj.getElementsByTagName(selector);
		}else if(/^<[a-z][a-z1-6]{0,10}>$/.test(selector)){
			return document.createElement(selector.slice(1,-1));
		}
		//插入新创建的标签
	}else if(typeof selector=="function"){
		addEvent(window,"load",selector);
	}
}
/*--------------------------去空格函数----------------------------------*/
/*trim	去掉空白
str要处理的字符串		
[type] 	类型：l 去除左边的空白	r去除右边空白	b去掉两边的空白		a去除所有空白*/

function trim (str,type) {
	var type=type||"b";
	if(type=="b"){
		return str.replace(/^\s*|\s*$/g,"");
	}else if(type=="l"){
		return str.replace(/^\s*/g,"");
	}else if(type=="r"){
		return str.replace(/\s*$/g,"");
	}else if(type=="a"){
		return str.replace(/\s*/g,"");
	}
}
/*-------------------查找name属性（解决兼容性问题）---------------------*/
/*本函数用于查找所有name属性相同的元素，ie9以下不兼容getElementsByName
  getName     通过name获取对象
  name        要找的name
  context     要找的范围
*/

function getName(name,context){
	var obj=context||document;
	if(obj.getElementsByClassName){					//这里写入if(obj.getElementsByName)也是一样的
		return document.getElementsByName(name);			/////////不可以传入环境
	}else{
		var arr=[];
		var all=obj.getElementsByTagName("*");
		for(var i=0;i<all.length;i++){
			//特指通过name这个属性获取元素，如果更改属性，则getAttribute("name")中的name也需要更改
			if(all[i].getAttribute("name")==name){
				arr.push(all[i]);
			}
		}
		return arr;
	}
}
/*---------------查找纯文本内容（解决兼容性问题）---------------------*/
/*解决textContent与innerText在ie9以下获取纯文本的兼容问题,
  如果传入只有obj（一个已经被获取的元素），则只是获取文本，
  如果传入obj的同时传入val，则表示要将获取到的文本替换
*/
function getText(obj,val){
	if(obj.innerText==undefined){
		if(val==undefined){
			return obj.textContent;
		}else{
			obj.textContent=val;
		}
	}else{
		if(val==undefined){
			return obj.innerText;
		}else{
			obj.innerText=val;
		}
	}
}

/*---------------------------获取元素的所有样式--------------------------------------*/
/* 由于在ie9以下的浏览器中不存在getComputedStyle,而是存在currentStyle，所以写函数getStyle实现浏览器中通用
* 由于传入的attr是需要获取的属性，而属性在这里传入的字符串，所以必须用aa[attr]，而不能写aa.attr
* 		obj-------通过某种方式选择到的元素
* 		attr------被获取元素的指定（attr）样式，传入的是字符串*/

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,null)[attr];
	}
}
/*------------------------------在js节点中获取真正的孩子兄弟节点-------------------------------------*/

/*-------由于获取孩子，兄弟节点会获取到空白，所以需要一个函数来去掉这些空白，获取到真正的我们想要的------------*/
/*		 			 [type]------------false则排除所有文本(空格和文本都排除)，
						 ------------true则不排除写的内容,
					  obj-------------想要获取子元素的元素*/
/*--------------------------------获取所有的孩子节点-----------------------------------------------*/
function getChilds(obj,type){
	var type = type==undefined ? false : type;
	var childs=obj.childNodes;
	var arr=[];
	for(var i=0;i<childs.length;i++){
		if(type===false){
			if(!(childs[i].nodeType==3||childs[i].nodeType==8)){		//注释文字值为8,空格或者文本为3
				arr.push(childs[i]);
			}
		}else if(type===true){
			if(!((childs[i].nodeType==3&&trim(childs[i].nodeValue)=="")||childs[i].nodeType==8)){
				arr.push(childs[i]);
			}
		}
	}
	return arr;
}

/*--------------------------------获取最后一个孩子节点------------------------------------*/
function getLast(obj,type){
	var childs= getChilds(obj,type);
	return childs[childs.length-1];
}
/*--------------------------------获取第一个孩子节点------------------------------------*/
function getFirst(obj,type){
	return getChilds(obj,type)[0];
}

/*-------------------------------获取下一个兄弟节点-------------------------------------*/

function getNext(obj,type){
	var type= type==undefined ? false:type;
	var next=obj.nextSibling;
	if(next==null){
		return false;
	}
	if(type===false){
		while(next.nodeType==3||next.nodeType==8){
			next=next.nextSibling;
			if(next==null){
				return false;
			}
		}
	}else if(type===true){
		while((next.nodeType==3&&trim(next.nodeValue)=="")||next.nodeType==8){
			next=next.nextSibling;
			if(next==null){
				return false;
			}
		}
	}
	return next;
}
/*-------------------------------------获取上一个兄弟节点---------------------------------*/

function getPre(obj,type){
	var type= type==undefined ? false:type;
	var pre=obj.previousSibling;
	if(pre==null){
		return false;
	}
	if(type===false){
		while(pre.nodeType==3||pre.nodeType==8){
			pre=pre.previousSibling;
			if(pre==null){
				return false;
			}
		}
		//return pre;
	}else if(type===true){
		while((pre.nodeType==3&&trim(pre.nodeValue)=="")||pre.nodeType==8){
			pre=pre.previousSibling;
			if(pre==null){
				return false;
			}
		}
		//return trim(pre.nodeValue);				//可以把获取到的字符串左右空格去掉
	}
	return pre;
}
/*插入到某个元素的后面
* obj----要 插入的元素
* objOr---插入到该元素的后面*/
function insertAfter(obj,objOr){
	var parent=objOr.parentNode;
	var next=getNext(objOr);
	if(!next){
		parent.appendChild(obj);
	}else{
		parent.insertBefore(obj,next);
	}
}
/*插入到某个元素的前面
 * obj----要 插入的元素
 * objOr---插入到该元素的后面*/
function insertBefore(obj,objOr){
	var parent=objOr.parentNode;
	parent.insertBefore(obj,objOr);
}
/*插入到父元素的最后
* parent	父元素
* obj 要插入的元素*/
function appendChild(parent,obj){
	parent.appendChild(obj);
}

/*插入父元素的最前面*/
function paddend(parent,obj){
	var first=getFirst(parent);
	if(!first){
		parent.appendChild(obj);
	}else{
		parent.insertBefore(obj,first);
	}
}

/*----------解决ie6不支持position:fixed属性-----------*/

function setFixed(obj,left,top){
	var lefts,tops;
	clearInterval(obj.timer);
	//可以实现浏览器是否为ie6的判断
	if(window.ActiveXObject&&!window.XMLHttpRequest){
		obj.style.position="absolute";
		window.timer=setInterval(function () {
			lefts=document.documentElement.scrollLeft;
			tops=document.documentElement.scrollTop;
			obj.style.left=left+lefts+"px";
			obj.style.top=top+tops+"px";
		},50);
	}else{
		obj.style.position="fixed";
		obj.style.left=left+"px";
		obj.style.top=top+"px";
	}
}

/*解决添加事件的兼容性问题-------
ie9以下只能使用attachEvent而其他新的浏览器需要用addEventListener*/
function addEvent(obj,event,callback){
	if(obj.addEventListener){
		obj.addEventListener(event,callback,false);
	}else if(obj.attachEvent){
		obj.attachEvent("on"+event,callback);
	}
}
/*上面的添加事件相应的删除事件的兼容函数*/
function removeEvent(obj,event,callback){
	if(obj.removeEventListener){
		obj.removeEventListener(event,callback,false);
		obj.removeEventListener(event,callback,false);
	}else if(obj.detachEvent){
		obj.detachEvent("on"+event,callback);
	}
}

/*获取相对于body的实际距离*/
function offset(obj){
	var result={left:0,top:0};
	var arr=[];
	arr.push(obj);
	while(obj.nodeName!=="BODY"){
		var obj=obj.parentNode;
		if(getStyle(obj,"position")=="absolute"||getStyle(obj,"position")=="relative"){
			arr.push(obj);
		}
	}
	for(var i=0;i<arr.length;i++){
		var bLWidth=parseInt(getStyle(arr[i],"borderLeftWidth"));
		var num1=bLWidth?bLWidth:0;
		var bTWidth=parseInt(getStyle(arr[i],"borderTopWidth"));
		var num2=bTWidth?bTWidth:0;

		left+=left+arr[i].offsetLeft+num1;
		top+=top+arr[i].offsetTop+num2;
	}
	return result;
}

/*拖拽事件*/
/*拖拽*/
function drag(obj,options){
	new drags(obj,options);
}
function drags(obj,options){
	var options=options||{};
	this.obj=obj;
	this.obj.that=this;
	document.that=this;
	this.dragX=options.dragX==undefined?true:options.dragX;
	this.dragY=options.dragY==undefined?true:options.dragY;
	this.sideX=options.sideX==undefined?false:options.sideX;
	this.sideY=options.sideY==undefined?false:options.sideY;
	this.animate=options.animate==undefined?true:options.animate;
	this.speed=0.8;
	this.play();
}
drags.prototype={
	play:function(){
		addEvent(this.obj,"mousedown",this.downFun)
	},
	downFun:function(e){
		var that=this.that;
		var e=that.getEvent(e);
		that.ox=that.getOx(e);
		that.oy=that.getOy(e);
		that.startX=that.ox;
		that.startY=that.oy;
		addEvent(document,"mousemove",that.moveFun);
		addEvent(document,"mouseup",that.upFun);

	},
	moveFun:function(e){
		var that=this.that;
		var e=that.getEvent(e);
		var cx= e.clientX;
		var cy= e.clientY;
		that.moveX=cx;
		that.moveY=cy;
		var lefts=cx-(offset(that.obj).left-that.obj.offsetLeft)-that.ox;
		var tops=cy-(offset(that.obj).top-that.obj.offsetTop)-that.oy;
		if(that.sideX){
			if(lefts<that.sideX[0]){
				lefts=that.sideX[0];
			}
			if(lefts>that.sideX[1]){
				lefts=that.sideX[1]
			}
		}

		if(that.sideY){
			if(tops<that.sideY[0]){
				tops=that.sideY[0];
			}
			if(tops>that.sideY[1]){
				tops=that.sideY[1]
			}
		}


		if(that.dragX==true) {
			that.obj.style.left = lefts + "px";
		}
		if(that.dragY==true) {
			that.obj.style.top = tops + "px";
		}

		that.endX=that.moveX-that.startX;
		that.endY=that.moveY-that.startY;
		that.startX=that.moveX;
		that.startY=that.moveY;
	},
	upFun:function(e){
		var that=this.that;
		if(that.animate) {
			that.move();
		}
		removeEvent(document,"mousemove",that.moveFun);
		removeEvent(document,"mouseup",that.upFun);
	},
	getEvent:function(e){
		return e||window.event;
	},
	getOx:function (e){
		return e.layerX|| e.offsetX||0
	},
	getOy:function (e){
		return e.layerY|| e.offsetY||0
	},
	move:function(){
		var that=this;
		var flag;
		if(Math.abs(this.endX)>Math.abs(this.endY)){
			flag=true;
		}else{
			flag=false;
		}
		var t=setInterval(function(){
			if(flag){
				if(Math.abs(that.endX)<1){
					clearInterval(t)
				}
			}else{
				if(Math.abs(that.endY)<1){
					clearInterval(t)
				}
			}
			that.endX*=that.speed;
			that.endY*=that.speed;
			var x=that.obj.offsetLeft+that.endX;
			var y=that.obj.offsetTop+that.endY;
			if(that.sideX){
				if(x<that.sideX[0]){
					x=that.sideX[0];
				}
				if(x>that.sideX[1]){
					x=that.sideX[1]
				}
			}

			if(that.sideY){
				if(y<that.sideY[0]){
					y=that.sideY[0];
				}
				if(y>that.sideY[1]){
					y=that.sideY[1]
				}
			}
			that.obj.style.left=x+"px";
			that.obj.style.top=y+"px";
		},50)
	}

};
/*鼠标滚轮事件*/
function mouseWheel(obj,upFun,downFun){
	if(obj.attachEvent){
		obj.attachEvent("onmousewheel",scrollFn);				//IE
	}else if(obj.addEventListener){
		obj.addEventListener("mousewheel",scrollFn,false);		//-webkit
		obj.addEventListener("DOMMouseScroll",scrollFn,false);	//-moz
	}
	function scrollFn(e){
		var ev=e||window.event;
		var num=ev.detail||ev.wheelDelta;
		if(num==120||num==-3){
			if(upFun){
				upFun.call(obj);
			}
		}else if(num==-120||num==3){
			if(downFun){
				downFun.call(obj);
			}
		}
		if(ev.preventDefault){
			ev.preventDefault();
		}else{
			ev.returnValue=false;
		}
	}

}
//判断某个元素是否包含有另外一个元素
 function contains (parent,child) {
	if(parent.contains){
	   return parent.contains(child) && parent!=child;
	}else{
	  return (parent.compareDocumentPosition(child)===20);
	}
 }

 //判断鼠标是否真正的从外部移入，或者是真正的移出到外部；

  function checkHover (e,target) {
	 if(getEvent(e).type=="mouseover"){
	    return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
		!((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
	 }else{
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
		!((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
		}
  }


//鼠标移入移除事件
/*
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover (obj,overfun,outfun) {
	  if(overfun){
	    obj.onmouseover=function  (e) {
			  if(checkHover(e,obj)){
			     overfun.call(obj,[e]);
			  }
	    }
	  }
	  if(outfun){
	    obj.onmouseout=function  (e) {
			  if(checkHover(e,obj)){
			     outfun.call(obj,[e]);
			  }
	    }
	  }
}
















