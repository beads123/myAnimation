myAnimation
-----------
#### <i class="icon-pencil"></i> Introduction
myAnimation is a simple javascript animation library for common animation effects and written by raw javascript.It can be
used in anywhere you want to show animation effects in your project.You can see the [demo](http://codepen.io/myzhibie/pen/vEvNQq) here to learn how to use it and what utilities it can provide.By the way,this simple library can meet your most demands in front-end programming.
#### <i class="icon-pencil"></i> How to use it?

first ,you must link the `animate.min.js` to your pages like this

    <script src="js/animate.min.js"></script>
this library exposes two methods to dealing with animation,their information are as below:<br>
#####myAnimate.css(obj, attr, val)
> - **overview:** this function(method) is used to get or set the style of a raw dom element.The length of its arguments can be two or three.If given two arguments like (obj,attr),it means gettting the style og this dom element.In another case (three arguments are given),it means setting the style of this dom element.The detail about every paramter are as below:
> - **paramter:** obj **type:dom element** obj is the raw dom element which you want to set or get its style.
> - **paramter:** attr **type:string** attr is the property of the dom 's style,for example:`width`,`height`,`opacity`,`...`
> - **paramter:** val **type:string** val is the value you want to set it to the dom element.Remember that it does not contain unit like `px`,`em`,'...' and if the attr is `opacity`,this value shoud be setted as value like `100`,`30`,`0`,not `1`,`0.3`.

#####myAnimate.run(obj, attrObj, dur, fn, callback):
> - **overview:** this function(method) is the main function to show animation effect on dom element,it has six paramters,`obj`,`attrObj`,`dur`are needed but `fn`,`callback` is optional,the detail of them are as below:
> - **paramter:** obj **type:dom element** obj is the raw dom element which you want to change or show animation effect on.
> - **paramter:** attrObj **type:object** attrObj is the array of the property of the dom element's style,you can send it as `{'width':100}`or `{'width':100,'height':100,'opacity':30}`.
> - **paramter:** dur **type:number** the duration of this animation ,its unit is ms,you can send `100`,`500`or other values.
> - **paramter:** fn **type:function(optional)** this is the  calculation function of this animation 's current distance during this animation.It is provided by this library ,you can see the [demo](http://codepen.io/myzhibie/pen/vEvNQq) to decide to use which animation style.If it is not given , defalut value is `myAnimate.Tween.Quad.easeIn`
> - **paramter:** callback **type:function(optional)**this is the callback function you want to execute after this animation's completion.It is optional,null means no callback.

#### <i class="icon-pencil"></i> example
##### set style

    myAnimate.css(obj,'width',100);
##### get style    

    var attr= myAnimate.css(obj,'width');
##### run animation

    myAnimate.run(obj,{'width':100,'height':100,'opacity'；30},500,myAnimate.Tween.Quad.easeIn,function(){
    console.log('completed');
    })
see [demo](http://codepen.io/myzhibie/pen/vEvNQq) for more informatiom. 

