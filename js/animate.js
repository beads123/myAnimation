(function (win) {
    if (!win.myAnimate) {
        win.myAnimate = {};
    }
    win.myAnimate = {
        run: function (obj, attrObj, dur, fn, callback) {
            var tween;
            var callfun;
            if (arguments.length == 4) {
                if (fn.length >= 4) {
                    tween = fn;
                    callfun = null;
                } else {
                    tween = win.myAnimate.Tween.Quad.easeIn;
                    callfun = fn;
                }
            } else {
                tween = fn ? fn : win.myAnimate.Tween.Quad.easeIn;
                callfun = callback ? callback : null;
            }
            this.Queue.queue(obj, "fx", function () {
                var start = []; //开始值数组
                var changes = [];//变化量数组
                var times = 0;
                for (var i in attrObj) {
                    start[i] = win.myAnimate.css(obj, i);
                    changes[i] = attrObj[i] - start[i];
                }
                obj.time = setInterval(function () {
                    var stops = true;
                    if (times < dur) {
                        stops = false;
                        for (var i in attrObj) {
                            win.myAnimate.css(obj, i, tween(times, start[i], changes[i], dur))
                        }
                    }
                    times += 5;

                    if (stops) {
                        for (var i in attrObj) {
                            win.myAnimate.css(obj, i, attrObj[i]);
                        }
                        clearInterval(obj.time);
                        if (callfun) {
                            callfun()
                        }
                        win.myAnimate.Queue.dequeue(obj, "fx");
                    }
                }, 5)
            })
        },
        //自建队列来控制回动画顺序的执行
        //以保证对动画效果的顺序执行
        //如果没有该队列，对动画函数的调用实际上是
        //同时进行的，除非使用回调函数来完成
        Queue: {
            queue: function (elem, key, val) {
                //fx表示存储的类型，如果是fx表示的是存储的是函数
                //可以执行
                var key = key ? key : "fx";
                var q = win.myAnimate.Data.setData(elem, key);
                if (!val) {
                    return q || [];
                }

                if (!q) {
                    //返回的q是个队列
                    q = win.myAnimate.Data.setData(elem, key, []);
                }

                if (val    instanceof  Array) {
                    q = win.myAnimate.Data.setData(elem, key, val);
                } else {
                    q.push(val);
                }
                //
                if (key == "fx" && q[0] != "mark") {
                    this.dequeue(elem, key)
                }

                return q;
            },
            wait: function (elem, key, num) {
                this.queue(elem, key, function () {
                    var t = setTimeout(function () {
                        clearTimeout(t);
                        this.dequeue(elem, key)
                    }, num)
                })
            },
            stop: function (elem, key) {
                this.queue(elem, key, []);
            },
            timeout: function (elem, key) {
                this.queue(elem, key).unshift("timeout")
            },
            dequeue: function (elem, key) {
                var key = key || "fx";
                var queue = win.myAnimate.Data.setData(elem, key);
                var fn = queue.shift();
                if (fn == "timeout") {
                    return;
                }
                if (fn == "mark") {
                    fn = queue.shift();
                }
                if (fn) {
                    if (key == "fx") {
                        //如果当前队列中第一个元素不是mark，表示
                        //第一个需要自动执行，执行完成后添加上mark
                        //其他都通过调用来执行
                        queue.unshift("mark")
                    }
                    fn.call(elem)
                }
            }

        },
        //缓存和DOM节点相关的数据
        Data: {
            cache: {},
            uuid: 0,
            expando: +new Date,
            setData: function (elem, key, val) {
                //给当前DOM元素添加一个随机属性
                //用来缓存数据，这个ID将dom元素和缓存
                //的数据关联了起来，这样关于每个DOM元素的所有运动
                //都会依次形成一个队列
                var id = elem[this.expando];
                if (!id) {
                    id = ++this.uuid;
                    elem[this.expando] = id;
                }
                if (!this.cache[id]) {
                    this.cache[id] = {};
                }

                if (val) {
                    this.cache[id][key] = val;
                }
                return  this.cache[id][key];
            }
        },
        //获取设置css函数
        css: function (obj, attr, val) {
            if (obj.nodeType != 1) {
                return;
            }
            var attr = attr.replace(/^\s+|\s+$/g, "");
            if (arguments.length == 2) {
                if (attr == "opacity") {

                    return Math.round(100 * parseFloat(obj.currentStyle ? (obj.currentStyle[attr] || 1) : (getComputedStyle(obj, null)[attr] || 1)));
                }
                if (attr == 'scrollTop' || attr == 'scrollLeft') {
                    return obj[attr];
                }
                if (attr == "width" || attr == "height" || attr == "top" || attr == "left") {
                    var str = "offset" + attr.replace(attr.charAt(0), attr.charAt(0).toUpperCase());
                    return obj[str];
                }

                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
            }

            if (arguments.length == 3) {
                switch (attr) {
                    case "width":
                    case "height":
                    case "top":
                    case "left":
                        obj.style[attr] = val + "px";
                        break;
                    case "opacity":
                        obj.style.filter = "alpha(opacity=" + val + ")";
                        obj.style[attr] = val / 100;
                        break;
                    case "scrollTop":
                    case "scrollLeft":
                        obj[attr] = val;
                        break;
                    default:
                        obj.style[attr] = val;
                }
            }
        },
        //动画算法
        Tween: {
            Linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            Quad: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                }
            },
            Quart: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                }
            },
            Quint: {
                easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                }
            },
            Sine: {
                easeIn: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                },
                easeInOut: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                },
                easeOut: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                },
                easeOut: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                },
                easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                },
                easeOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (!p) p = d * .3;
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                },
                easeInOut: function (t, b, c, d, a, p) {
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (!p) p = d * (.3 * 1.5);
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    }
                    else var s = p / (2 * Math.PI) * Math.asin(c / a);
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                }
            },
            Back: {
                easeIn: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                },
                easeOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                },
                easeInOut: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function (t, b, c, d) {
                    return c - win.myAnimate.Tween.Bounce.easeOut(d - t, 0, c, d) + b;
                },
                easeOut: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                        return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                },
                easeInOut: function (t, b, c, d) {
                    if (t < d / 2) return win.myAnimate.Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                    else return win.myAnimate.Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        }

    }


})(window);