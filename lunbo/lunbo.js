function Lunbo(opts) {

    this.opts = {
        wrap: '.wrap',
        items: '.item',
        delayTime: 2000,
        autoPlay: true,
        isBlur: true,
        current: 1
    }

    for (var i in opts) {
        this.opts[i] = opts[i]
    }

    this.init();
}

Lunbo.prototype = {
    wrap: null,
    items: null,
    length: 0,
    time: 0,
    arrWidth: [],
    arrHeight: [],
    arrTop: [],
    arrLeft: [],
    arrCengci: [],
    $: function(o, n) {
        return (n || document).querySelectorAll(o);
    },
    getItemStyle: function (pic) {
        var self = this;
        Array.prototype.forEach.call(pic, function (item, i) {
            self.arrWidth[i] =  self.getDefaultStyle(pic[i], 'width');
            self.arrHeight[i] = self.getDefaultStyle(pic[i], 'height');
            self.arrTop[i] = item.offsetTop;
            self.arrLeft[i] = item.offsetLeft;
            self.arrCengci[i] = self.getDefaultStyle(pic[i], 'z-index');
            item.style.top = self.arrTop[i] + 'px';
            item.style.left =self.arrLeft[i] + 'px';
        });
    },
    getDefaultStyle: function (obj, attr) {
        return obj.currentStyle
            ? obj.currentStyle[attr]
            : document.defaultView.getComputedStyle(obj, false)[attr];
    },
    _setStyle: function () {
        var _style = document.createElement('style');
        
        var str = this.opts.wrap + ' {\
                position: relative;\
            }' + this.opts.items + ' {\
                -webkit-transition: all ' + this.opts.delayTime + 'ms;\
                -o-transition: all ' + this.opts.delayTime + 'ms;\
                transition: all ' + this.opts.delayTime + 'ms;\
                position: absolute;\
            }';  
        this.opts.isBlur && (str += '.blur {\
            -webkit-filter: blur(3px);\
            -o-filter: blur(3px);\
            filter: blur(3px);\
        }');

        _style.type = 'text/css';  
        _style.styleSheet
            ? _style.styleSheet.cssText = str
            : _style.innerHTML = str

        var heads = document.getElementsByTagName('head');  
        heads.length
            ? heads[0].appendChild(_style)
            : doc.documentElement.appendChild(_style);
    },
    autoPlay: function() {
        var self = this;
        setInterval(function() {
            self.next();
        }, self.opts.delayTime);
    },
    init: function () {
        var self = this;
        self.items = typeof self.opts.items == 'string' ? self.$(self.opts.wrap + ' ' + self.opts.items) : self.opts.items ;
        self.getItemStyle(self.items);
        self.length = self.items.length;
        self.time = new Date();
        self._setStyle();
        self.opts.autoPlay && self.autoPlay();
    },
    next: function () {
        new Date() - this.time > this.opts.delayTime && this.lunbo(1);
    },
    prev: function () {
        new Date() - this.time > this.opts.delayTime && this.lunbo(0);
    },
    lunbo: function (state) {
        this.time = new Date();

        state === 0
            ? (this.opts.current + 1 > this.length - 1 ? (this.opts.current = 0) : (this.opts.current = this.opts.current + 1))
            : (this.opts.current - 1 < 0 ? (this.opts.current = this.length - 1) : (this.opts.current = this.opts.current - 1));
       
        this.getItemStyle(this.items);

        var a = 0;
        for (var i = 0; i < this.items.length; i++) {

            if (state === 0) {
                i === 0 ? a = this.length - 1 : a = i - 1;
            }
            else {
                i === this.length - 1 ? a = 0 : a = i + 1;
            }

            this.items[i].style.width = this.arrWidth[a];
            this.items[i].style.height = this.arrHeight[a];
            this.items[i].style.top = this.arrTop[a] + 'px';
            this.items[i].style.left = this.arrLeft[a] + 'px';
            this.items[i].style.zIndex = this.arrCengci[a];
            
            if (i === this.opts.current) {
                this.items[i].className =  this.items[i].className.replace(/ blur/g, '');
            }
            else {
                this.items[i].className += ' blur';
            }
            
        }
    }
};

if (typeof module == 'object') {
    module.exports = Lunbo;
}
else {
    window.Lunbo = Lunbo;
}