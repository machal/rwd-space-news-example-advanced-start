(function(i, n, j, p) {
    "use strict";
    var o = j("html"), a = j(i), f = j(n), M = j.fancybox = function() {
        M.open.apply(this, arguments);
    }, r = navigator.userAgent.match(/msie/i), s = null, l = n.createTouch !== p, u = function(e) {
        return e && e.hasOwnProperty && e instanceof j;
    }, h = function(e) {
        return e && j.type(e) === "string";
    }, A = function(e) {
        return h(e) && e.indexOf("%") > 0;
    }, c = function(e) {
        return e && !(e.style.overflow && e.style.overflow === "hidden") && (e.clientWidth && e.scrollWidth > e.clientWidth || e.clientHeight && e.scrollHeight > e.clientHeight);
    }, I = function(e, t) {
        var i = parseInt(e, 10) || 0;
        if (t && A(e)) {
            i = M.getViewport()[t] / 100 * i;
        }
        return Math.ceil(i);
    }, D = function(e, t) {
        return I(e, t) + "px";
    };
    j.extend(M, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: true,
            autoHeight: false,
            autoWidth: false,
            autoResize: true,
            autoCenter: !l,
            fitToView: true,
            aspectRatio: false,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: true,
            closeBtn: true,
            closeClick: false,
            nextClick: false,
            mouseWheel: true,
            autoPlay: false,
            playSpeed: 3e3,
            preload: 3,
            modal: false,
            loop: true,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": true
                }
            },
            iframe: {
                scrolling: "auto",
                preload: true
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [ 27 ],
                play: [ 32 ],
                toggle: [ 70 ]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: true,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (r ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
                loading: '<div id="fancybox-loading"><div></div></div>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: true,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: true,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: true,
                title: true
            },
            onCancel: j.noop,
            beforeLoad: j.noop,
            afterLoad: j.noop,
            beforeShow: j.noop,
            afterShow: j.noop,
            beforeChange: j.noop,
            beforeClose: j.noop,
            afterClose: j.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: false,
        isOpen: false,
        isOpened: false,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: false
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(c, d) {
            if (!c) {
                return;
            }
            if (!j.isPlainObject(d)) {
                d = {};
            }
            if (false === M.close(true)) {
                return;
            }
            if (!j.isArray(c)) {
                c = u(c) ? j(c).get() : [ c ];
            }
            j.each(c, function(e, t) {
                var i = {}, n, o, a, r, s, l, f;
                if (j.type(t) === "object") {
                    if (t.nodeType) {
                        t = j(t);
                    }
                    if (u(t)) {
                        i = {
                            href: t.data("fancybox-href") || t.attr("href"),
                            title: j("<div/>").text(t.data("fancybox-title") || t.attr("title") || "").html(),
                            isDom: true,
                            element: t
                        };
                        if (j.metadata) {
                            j.extend(true, i, t.metadata());
                        }
                    } else {
                        i = t;
                    }
                }
                n = d.href || i.href || (h(t) ? t : null);
                o = d.title !== p ? d.title : i.title || "";
                a = d.content || i.content;
                r = a ? "html" : d.type || i.type;
                if (!r && i.isDom) {
                    r = t.data("fancybox-type");
                    if (!r) {
                        s = t.prop("class").match(/fancybox\.(\w+)/);
                        r = s ? s[1] : null;
                    }
                }
                if (h(n)) {
                    if (!r) {
                        if (M.isImage(n)) {
                            r = "image";
                        } else if (M.isSWF(n)) {
                            r = "swf";
                        } else if (n.charAt(0) === "#") {
                            r = "inline";
                        } else if (h(t)) {
                            r = "html";
                            a = t;
                        }
                    }
                    if (r === "ajax") {
                        l = n.split(/\s+/, 2);
                        n = l.shift();
                        f = l.shift();
                    }
                }
                if (!a) {
                    if (r === "inline") {
                        if (n) {
                            a = j(h(n) ? n.replace(/.*(?=#[^\s]+$)/, "") : n);
                        } else if (i.isDom) {
                            a = t;
                        }
                    } else if (r === "html") {
                        a = n;
                    } else if (!r && !n && i.isDom) {
                        r = "inline";
                        a = t;
                    }
                }
                j.extend(i, {
                    href: n,
                    type: r,
                    content: a,
                    title: o,
                    selector: f
                });
                c[e] = i;
            });
            M.opts = j.extend(true, {}, M.defaults, d);
            if (d.keys !== p) {
                M.opts.keys = d.keys ? j.extend({}, M.defaults.keys, d.keys) : false;
            }
            M.group = c;
            return M._start(M.opts.index);
        },
        cancel: function() {
            var e = M.coming;
            if (e && false === M.trigger("onCancel")) {
                return;
            }
            M.hideLoading();
            if (!e) {
                return;
            }
            if (M.ajaxLoad) {
                M.ajaxLoad.abort();
            }
            M.ajaxLoad = null;
            if (M.imgPreload) {
                M.imgPreload.onload = M.imgPreload.onerror = null;
            }
            if (e.wrap) {
                e.wrap.stop(true, true).trigger("onReset").remove();
            }
            M.coming = null;
            if (!M.current) {
                M._afterZoomOut(e);
            }
        },
        close: function(e) {
            M.cancel();
            if (false === M.trigger("beforeClose")) {
                return;
            }
            M.unbindEvents();
            if (!M.isActive) {
                return;
            }
            if (!M.isOpen || e === true) {
                j(".fancybox-wrap").stop(true).trigger("onReset").remove();
                M._afterZoomOut();
            } else {
                M.isOpen = M.isOpened = false;
                M.isClosing = true;
                j(".fancybox-item, .fancybox-nav").remove();
                M.wrap.stop(true, true).removeClass("fancybox-opened");
                M.transitions[M.current.closeMethod]();
            }
        },
        play: function(e) {
            var t = function() {
                clearTimeout(M.player.timer);
            }, i = function() {
                t();
                if (M.current && M.player.isActive) {
                    M.player.timer = setTimeout(M.next, M.current.playSpeed);
                }
            }, n = function() {
                t();
                f.unbind(".player");
                M.player.isActive = false;
                M.trigger("onPlayEnd");
            }, o = function() {
                if (M.current && (M.current.loop || M.current.index < M.group.length - 1)) {
                    M.player.isActive = true;
                    f.bind({
                        "onCancel.player beforeClose.player": n,
                        "onUpdate.player": i,
                        "beforeLoad.player": t
                    });
                    i();
                    M.trigger("onPlayStart");
                }
            };
            if (e === true || !M.player.isActive && e !== false) {
                o();
            } else {
                n();
            }
        },
        next: function(e) {
            var t = M.current;
            if (t) {
                if (!h(e)) {
                    e = t.direction.next;
                }
                M.jumpto(t.index + 1, e, "next");
            }
        },
        prev: function(e) {
            var t = M.current;
            if (t) {
                if (!h(e)) {
                    e = t.direction.prev;
                }
                M.jumpto(t.index - 1, e, "prev");
            }
        },
        jumpto: function(e, t, i) {
            var n = M.current;
            if (!n) {
                return;
            }
            e = I(e);
            M.direction = t || n.direction[e >= n.index ? "next" : "prev"];
            M.router = i || "jumpto";
            if (n.loop) {
                if (e < 0) {
                    e = n.group.length + e % n.group.length;
                }
                e = e % n.group.length;
            }
            if (n.group[e] !== p) {
                M.cancel();
                M._start(e);
            }
        },
        reposition: function(e, t) {
            var i = M.current, n = i ? i.wrap : null, o;
            if (n) {
                o = M._getPosition(t);
                if (e && e.type === "scroll") {
                    delete o.position;
                    n.stop(true, true).animate(o, 200);
                } else {
                    n.css(o);
                    i.pos = j.extend({}, i.dim, o);
                }
            }
        },
        update: function(t) {
            var i = t && t.originalEvent && t.originalEvent.type, n = !i || i === "orientationchange";
            if (n) {
                clearTimeout(s);
                s = null;
            }
            if (!M.isOpen || s) {
                return;
            }
            s = setTimeout(function() {
                var e = M.current;
                if (!e || M.isClosing) {
                    return;
                }
                M.wrap.removeClass("fancybox-tmp");
                if (n || i === "load" || i === "resize" && e.autoResize) {
                    M._setDimension();
                }
                if (!(i === "scroll" && e.canShrink)) {
                    M.reposition(t);
                }
                M.trigger("onUpdate");
                s = null;
            }, n && !l ? 0 : 300);
        },
        toggle: function(e) {
            if (M.isOpen) {
                M.current.fitToView = j.type(e) === "boolean" ? e : !M.current.fitToView;
                if (l) {
                    M.wrap.removeAttr("style").addClass("fancybox-tmp");
                    M.trigger("onUpdate");
                }
                M.update();
            }
        },
        hideLoading: function() {
            f.unbind(".loading");
            j("#fancybox-loading").remove();
        },
        showLoading: function() {
            var e, t;
            M.hideLoading();
            e = j(M.opts.tpl.loading).click(M.cancel).appendTo("body");
            f.bind("keydown.loading", function(e) {
                if ((e.which || e.keyCode) === 27) {
                    e.preventDefault();
                    M.cancel();
                }
            });
            if (!M.defaults.fixed) {
                t = M.getViewport();
                e.css({
                    position: "absolute",
                    top: t.h * .5 + t.y,
                    left: t.w * .5 + t.x
                });
            }
            M.trigger("onLoading");
        },
        getViewport: function() {
            var e = M.current && M.current.locked || false, t = {
                x: a.scrollLeft(),
                y: a.scrollTop()
            };
            if (e && e.length) {
                t.w = e[0].clientWidth;
                t.h = e[0].clientHeight;
            } else {
                t.w = l && i.innerWidth ? i.innerWidth : a.width();
                t.h = l && i.innerHeight ? i.innerHeight : a.height();
            }
            return t;
        },
        unbindEvents: function() {
            if (M.wrap && u(M.wrap)) {
                M.wrap.unbind(".fb");
            }
            f.unbind(".fb");
            a.unbind(".fb");
        },
        bindEvents: function() {
            var s = M.current, t;
            if (!s) {
                return;
            }
            a.bind("orientationchange.fb" + (l ? "" : " resize.fb") + (s.autoCenter && !s.locked ? " scroll.fb" : ""), M.update);
            t = s.keys;
            if (t) {
                f.bind("keydown.fb", function(i) {
                    var n = i.which || i.keyCode, e = i.target || i.srcElement;
                    if (n === 27 && M.coming) {
                        return false;
                    }
                    if (!i.ctrlKey && !i.altKey && !i.shiftKey && !i.metaKey && !(e && (e.type || j(e).is("[contenteditable]")))) {
                        j.each(t, function(e, t) {
                            if (s.group.length > 1 && t[n] !== p) {
                                M[e](t[n]);
                                i.preventDefault();
                                return false;
                            }
                            if (j.inArray(n, t) > -1) {
                                M[e]();
                                i.preventDefault();
                                return false;
                            }
                        });
                    }
                });
            }
            if (j.fn.mousewheel && s.mouseWheel) {
                M.wrap.bind("mousewheel.fb", function(e, t, i, n) {
                    var o = e.target || null, a = j(o), r = false;
                    while (a.length) {
                        if (r || a.is(".fancybox-skin") || a.is(".fancybox-wrap")) {
                            break;
                        }
                        r = c(a[0]);
                        a = j(a).parent();
                    }
                    if (t !== 0 && !r) {
                        if (M.group.length > 1 && !s.canShrink) {
                            if (n > 0 || i > 0) {
                                M.prev(n > 0 ? "down" : "left");
                            } else if (n < 0 || i < 0) {
                                M.next(n < 0 ? "up" : "right");
                            }
                            e.preventDefault();
                        }
                    }
                });
            }
        },
        trigger: function(i, e) {
            var t, n = e || M.coming || M.current;
            if (n) {
                if (j.isFunction(n[i])) {
                    t = n[i].apply(n, Array.prototype.slice.call(arguments, 1));
                }
                if (t === false) {
                    return false;
                }
                if (n.helpers) {
                    j.each(n.helpers, function(e, t) {
                        if (t && M.helpers[e] && j.isFunction(M.helpers[e][i])) {
                            M.helpers[e][i](j.extend(true, {}, M.helpers[e].defaults, t), n);
                        }
                    });
                }
            }
            f.trigger(i);
        },
        isImage: function(e) {
            return h(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },
        isSWF: function(e) {
            return h(e) && e.match(/\.(swf)((\?|#).*)?$/i);
        },
        _start: function(e) {
            var i = {}, t, n, o, a, r;
            e = I(e);
            t = M.group[e] || null;
            if (!t) {
                return false;
            }
            i = j.extend(true, {}, M.opts, t);
            a = i.margin;
            r = i.padding;
            if (j.type(a) === "number") {
                i.margin = [ a, a, a, a ];
            }
            if (j.type(r) === "number") {
                i.padding = [ r, r, r, r ];
            }
            if (i.modal) {
                j.extend(true, i, {
                    closeBtn: false,
                    closeClick: false,
                    nextClick: false,
                    arrows: false,
                    mouseWheel: false,
                    keys: null,
                    helpers: {
                        overlay: {
                            closeClick: false
                        }
                    }
                });
            }
            if (i.autoSize) {
                i.autoWidth = i.autoHeight = true;
            }
            if (i.width === "auto") {
                i.autoWidth = true;
            }
            if (i.height === "auto") {
                i.autoHeight = true;
            }
            i.group = M.group;
            i.index = e;
            M.coming = i;
            if (false === M.trigger("beforeLoad")) {
                M.coming = null;
                return;
            }
            o = i.type;
            n = i.href;
            if (!o) {
                M.coming = null;
                if (M.current && M.router && M.router !== "jumpto") {
                    M.current.index = e;
                    return M[M.router](M.direction);
                }
                return false;
            }
            M.isActive = true;
            if (o === "image" || o === "swf") {
                i.autoHeight = i.autoWidth = false;
                i.scrolling = "visible";
            }
            if (o === "image") {
                i.aspectRatio = true;
            }
            if (o === "iframe" && l) {
                i.scrolling = "scroll";
            }
            i.wrap = j(i.tpl.wrap).addClass("fancybox-" + (l ? "mobile" : "desktop") + " fancybox-type-" + o + " fancybox-tmp " + i.wrapCSS).appendTo(i.parent || "body");
            j.extend(i, {
                skin: j(".fancybox-skin", i.wrap),
                outer: j(".fancybox-outer", i.wrap),
                inner: j(".fancybox-inner", i.wrap)
            });
            j.each([ "Top", "Right", "Bottom", "Left" ], function(e, t) {
                i.skin.css("padding" + t, D(i.padding[e]));
            });
            M.trigger("onReady");
            if (o === "inline" || o === "html") {
                if (!i.content || !i.content.length) {
                    return M._error("content");
                }
            } else if (!n) {
                return M._error("href");
            }
            if (o === "image") {
                M._loadImage();
            } else if (o === "ajax") {
                M._loadAjax();
            } else if (o === "iframe") {
                M._loadIframe();
            } else {
                M._afterLoad();
            }
        },
        _error: function(e) {
            j.extend(M.coming, {
                type: "html",
                autoWidth: true,
                autoHeight: true,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: e,
                content: M.coming.tpl.error
            });
            M._afterLoad();
        },
        _loadImage: function() {
            var e = M.imgPreload = new Image();
            e.onload = function() {
                this.onload = this.onerror = null;
                M.coming.width = this.width / M.opts.pixelRatio;
                M.coming.height = this.height / M.opts.pixelRatio;
                M._afterLoad();
            };
            e.onerror = function() {
                this.onload = this.onerror = null;
                M._error("image");
            };
            e.src = M.coming.href;
            if (e.complete !== true) {
                M.showLoading();
            }
        },
        _loadAjax: function() {
            var i = M.coming;
            M.showLoading();
            M.ajaxLoad = j.ajax(j.extend({}, i.ajax, {
                url: i.href,
                error: function(e, t) {
                    if (M.coming && t !== "abort") {
                        M._error("ajax", e);
                    } else {
                        M.hideLoading();
                    }
                },
                success: function(e, t) {
                    if (t === "success") {
                        i.content = e;
                        M._afterLoad();
                    }
                }
            }));
        },
        _loadIframe: function() {
            var e = M.coming, t = j(e.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime())).attr("scrolling", l ? "auto" : e.iframe.scrolling).attr("src", e.href);
            j(e.wrap).bind("onReset", function() {
                try {
                    j(this).find("iframe").hide().attr("src", "//about:blank").end().empty();
                } catch (e) {}
            });
            if (e.iframe.preload) {
                M.showLoading();
                t.one("load", function() {
                    j(this).data("ready", 1);
                    if (!l) {
                        j(this).bind("load.fb", M.update);
                    }
                    j(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                    M._afterLoad();
                });
            }
            e.content = t.appendTo(e.inner);
            if (!e.iframe.preload) {
                M._afterLoad();
            }
        },
        _preloadImages: function() {
            var e = M.group, t = M.current, i = e.length, n = t.preload ? Math.min(t.preload, i - 1) : 0, o, a;
            for (a = 1; a <= n; a += 1) {
                o = e[(t.index + a) % i];
                if (o.type === "image" && o.href) {
                    new Image().src = o.href;
                }
            }
        },
        _afterLoad: function() {
            var e = M.coming, t = M.current, i = "fancybox-placeholder", n, o, a, r, s, l;
            M.hideLoading();
            if (!e || M.isActive === false) {
                return;
            }
            if (false === M.trigger("afterLoad", e, t)) {
                e.wrap.stop(true).trigger("onReset").remove();
                M.coming = null;
                return;
            }
            if (t) {
                M.trigger("beforeChange", t);
                t.wrap.stop(true).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove();
            }
            M.unbindEvents();
            n = e;
            o = e.content;
            a = e.type;
            r = e.scrolling;
            j.extend(M, {
                wrap: n.wrap,
                skin: n.skin,
                outer: n.outer,
                inner: n.inner,
                current: n,
                previous: t
            });
            s = n.href;
            switch (a) {
              case "inline":
              case "ajax":
              case "html":
                if (n.selector) {
                    o = j("<div>").html(o).find(n.selector);
                } else if (u(o)) {
                    if (!o.data(i)) {
                        o.data(i, j('<div class="' + i + '"></div>').insertAfter(o).hide());
                    }
                    o = o.show().detach();
                    n.wrap.bind("onReset", function() {
                        if (j(this).find(o).length) {
                            o.hide().replaceAll(o.data(i)).data(i, false);
                        }
                    });
                }
                break;

              case "image":
                o = n.tpl.image.replace(/\{href\}/g, s);
                break;

              case "swf":
                o = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + s + '"></param>';
                l = "";
                j.each(n.swf, function(e, t) {
                    o += '<param name="' + e + '" value="' + t + '"></param>';
                    l += " " + e + '="' + t + '"';
                });
                o += '<embed src="' + s + '" type="application/x-shockwave-flash" width="100%" height="100%"' + l + "></embed></object>";
                break;
            }
            if (!(u(o) && o.parent().is(n.inner))) {
                n.inner.append(o);
            }
            M.trigger("beforeShow");
            n.inner.css("overflow", r === "yes" ? "scroll" : r === "no" ? "hidden" : r);
            M._setDimension();
            M.reposition();
            M.isOpen = false;
            M.coming = null;
            M.bindEvents();
            if (!M.isOpened) {
                j(".fancybox-wrap").not(n.wrap).stop(true).trigger("onReset").remove();
            } else if (t.prevMethod) {
                M.transitions[t.prevMethod]();
            }
            M.transitions[M.isOpened ? n.nextMethod : n.openMethod]();
            M._preloadImages();
        },
        _setDimension: function() {
            var e = M.getViewport(), t = 0, i = false, n = false, o = M.wrap, a = M.skin, r = M.inner, s = M.current, l = s.width, f = s.height, c = s.minWidth, d = s.minHeight, p = s.maxWidth, u = s.maxHeight, h = s.scrolling, g = s.scrollOutside ? s.scrollbarWidth : 0, m = s.margin, y = I(m[1] + m[3]), x = I(m[0] + m[2]), v, w, b, k, C, O, W, _, S, T, E, L, H, P, R;
            o.add(a).add(r).width("auto").height("auto").removeClass("fancybox-tmp");
            v = I(a.outerWidth(true) - a.width());
            w = I(a.outerHeight(true) - a.height());
            b = y + v;
            k = x + w;
            C = A(l) ? (e.w - b) * I(l) / 100 : l;
            O = A(f) ? (e.h - k) * I(f) / 100 : f;
            if (s.type === "iframe") {
                P = s.content;
                if (s.autoHeight && P.data("ready") === 1) {
                    try {
                        if (P[0].contentWindow.document.location) {
                            r.width(C).height(9999);
                            R = P.contents().find("body");
                            if (g) {
                                R.css("overflow-x", "hidden");
                            }
                            O = R.outerHeight(true);
                        }
                    } catch (e) {}
                }
            } else if (s.autoWidth || s.autoHeight) {
                r.addClass("fancybox-tmp");
                if (!s.autoWidth) {
                    r.width(C);
                }
                if (!s.autoHeight) {
                    r.height(O);
                }
                if (s.autoWidth) {
                    C = r.width();
                }
                if (s.autoHeight) {
                    O = r.height();
                }
                r.removeClass("fancybox-tmp");
            }
            l = I(C);
            f = I(O);
            S = C / O;
            c = I(A(c) ? I(c, "w") - b : c);
            p = I(A(p) ? I(p, "w") - b : p);
            d = I(A(d) ? I(d, "h") - k : d);
            u = I(A(u) ? I(u, "h") - k : u);
            W = p;
            _ = u;
            if (s.fitToView) {
                p = Math.min(e.w - b, p);
                u = Math.min(e.h - k, u);
            }
            L = e.w - y;
            H = e.h - x;
            if (s.aspectRatio) {
                if (l > p) {
                    l = p;
                    f = I(l / S);
                }
                if (f > u) {
                    f = u;
                    l = I(f * S);
                }
                if (l < c) {
                    l = c;
                    f = I(l / S);
                }
                if (f < d) {
                    f = d;
                    l = I(f * S);
                }
            } else {
                l = Math.max(c, Math.min(l, p));
                if (s.autoHeight && s.type !== "iframe") {
                    r.width(l);
                    f = r.height();
                }
                f = Math.max(d, Math.min(f, u));
            }
            if (s.fitToView) {
                r.width(l).height(f);
                o.width(l + v);
                T = o.width();
                E = o.height();
                if (s.aspectRatio) {
                    while ((T > L || E > H) && l > c && f > d) {
                        if (t++ > 19) {
                            break;
                        }
                        f = Math.max(d, Math.min(u, f - 10));
                        l = I(f * S);
                        if (l < c) {
                            l = c;
                            f = I(l / S);
                        }
                        if (l > p) {
                            l = p;
                            f = I(l / S);
                        }
                        r.width(l).height(f);
                        o.width(l + v);
                        T = o.width();
                        E = o.height();
                    }
                } else {
                    l = Math.max(c, Math.min(l, l - (T - L)));
                    f = Math.max(d, Math.min(f, f - (E - H)));
                }
            }
            if (g && h === "auto" && f < O && l + v + g < L) {
                l += g;
            }
            r.width(l).height(f);
            o.width(l + v);
            T = o.width();
            E = o.height();
            i = (T > L || E > H) && l > c && f > d;
            n = s.aspectRatio ? l < W && f < _ && l < C && f < O : (l < W || f < _) && (l < C || f < O);
            j.extend(s, {
                dim: {
                    width: D(T),
                    height: D(E)
                },
                origWidth: C,
                origHeight: O,
                canShrink: i,
                canExpand: n,
                wPadding: v,
                hPadding: w,
                wrapSpace: E - a.outerHeight(true),
                skinSpace: a.height() - f
            });
            if (!P && s.autoHeight && f > d && f < u && !n) {
                r.height("auto");
            }
        },
        _getPosition: function(e) {
            var t = M.current, i = M.getViewport(), n = t.margin, o = M.wrap.width() + n[1] + n[3], a = M.wrap.height() + n[0] + n[2], r = {
                position: "absolute",
                top: n[0],
                left: n[3]
            };
            if (t.autoCenter && t.fixed && !e && a <= i.h && o <= i.w) {
                r.position = "fixed";
            } else if (!t.locked) {
                r.top += i.y;
                r.left += i.x;
            }
            r.top = D(Math.max(r.top, r.top + (i.h - a) * t.topRatio));
            r.left = D(Math.max(r.left, r.left + (i.w - o) * t.leftRatio));
            return r;
        },
        _afterZoomIn: function() {
            var t = M.current;
            if (!t) {
                return;
            }
            M.isOpen = M.isOpened = true;
            M.wrap.css("overflow", "visible").addClass("fancybox-opened").hide().show(0);
            M.update();
            if (t.closeClick || t.nextClick && M.group.length > 1) {
                M.inner.css("cursor", "pointer").bind("click.fb", function(e) {
                    if (!j(e.target).is("a") && !j(e.target).parent().is("a")) {
                        e.preventDefault();
                        M[t.closeClick ? "close" : "next"]();
                    }
                });
            }
            if (t.closeBtn) {
                j(t.tpl.closeBtn).appendTo(M.skin).bind("click.fb", function(e) {
                    e.preventDefault();
                    M.close();
                });
            }
            if (t.arrows && M.group.length > 1) {
                if (t.loop || t.index > 0) {
                    j(t.tpl.prev).appendTo(M.outer).bind("click.fb", M.prev);
                }
                if (t.loop || t.index < M.group.length - 1) {
                    j(t.tpl.next).appendTo(M.outer).bind("click.fb", M.next);
                }
            }
            M.trigger("afterShow");
            if (!t.loop && t.index === t.group.length - 1) {
                M.play(false);
            } else if (M.opts.autoPlay && !M.player.isActive) {
                M.opts.autoPlay = false;
                M.play(true);
            }
        },
        _afterZoomOut: function(e) {
            e = e || M.current;
            j(".fancybox-wrap").trigger("onReset").remove();
            j.extend(M, {
                group: {},
                opts: {},
                router: false,
                current: null,
                isActive: false,
                isOpened: false,
                isOpen: false,
                isClosing: false,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            M.trigger("afterClose", e);
        }
    });
    M.transitions = {
        getOrigPosition: function() {
            var e = M.current, t = e.element, i = e.orig, n = {}, o = 50, a = 50, r = e.hPadding, s = e.wPadding, l = M.getViewport();
            if (!i && e.isDom && t.is(":visible")) {
                i = t.find("img:first");
                if (!i.length) {
                    i = t;
                }
            }
            if (u(i)) {
                n = i.offset();
                if (i.is("img")) {
                    o = i.outerWidth();
                    a = i.outerHeight();
                }
            } else {
                n.top = l.y + (l.h - a) * e.topRatio;
                n.left = l.x + (l.w - o) * e.leftRatio;
            }
            if (M.wrap.css("position") === "fixed" || e.locked) {
                n.top -= l.y;
                n.left -= l.x;
            }
            n = {
                top: D(n.top - r * e.topRatio),
                left: D(n.left - s * e.leftRatio),
                width: D(o + s),
                height: D(a + r)
            };
            return n;
        },
        step: function(e, t) {
            var i, n, o, a = t.prop, r = M.current, s = r.wrapSpace, l = r.skinSpace;
            if (a === "width" || a === "height") {
                i = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start);
                if (M.isClosing) {
                    i = 1 - i;
                }
                n = a === "width" ? r.wPadding : r.hPadding;
                o = e - n;
                M.skin[a](I(a === "width" ? o : o - s * i));
                M.inner[a](I(a === "width" ? o : o - s * i - l * i));
            }
        },
        zoomIn: function() {
            var e = M.current, t = e.pos, i = e.openEffect, n = i === "elastic", o = j.extend({
                opacity: 1
            }, t);
            delete o.position;
            if (n) {
                t = this.getOrigPosition();
                if (e.openOpacity) {
                    t.opacity = .1;
                }
            } else if (i === "fade") {
                t.opacity = .1;
            }
            M.wrap.css(t).animate(o, {
                duration: i === "none" ? 0 : e.openSpeed,
                easing: e.openEasing,
                step: n ? this.step : null,
                complete: M._afterZoomIn
            });
        },
        zoomOut: function() {
            var e = M.current, t = e.closeEffect, i = t === "elastic", n = {
                opacity: .1
            };
            if (i) {
                n = this.getOrigPosition();
                if (e.closeOpacity) {
                    n.opacity = .1;
                }
            }
            M.wrap.animate(n, {
                duration: t === "none" ? 0 : e.closeSpeed,
                easing: e.closeEasing,
                step: i ? this.step : null,
                complete: M._afterZoomOut
            });
        },
        changeIn: function() {
            var e = M.current, t = e.nextEffect, i = e.pos, n = {
                opacity: 1
            }, o = M.direction, a = 200, r;
            i.opacity = .1;
            if (t === "elastic") {
                r = o === "down" || o === "up" ? "top" : "left";
                if (o === "down" || o === "right") {
                    i[r] = D(I(i[r]) - a);
                    n[r] = "+=" + a + "px";
                } else {
                    i[r] = D(I(i[r]) + a);
                    n[r] = "-=" + a + "px";
                }
            }
            if (t === "none") {
                M._afterZoomIn();
            } else {
                M.wrap.css(i).animate(n, {
                    duration: e.nextSpeed,
                    easing: e.nextEasing,
                    complete: M._afterZoomIn
                });
            }
        },
        changeOut: function() {
            var e = M.previous, t = e.prevEffect, i = {
                opacity: .1
            }, n = M.direction, o = 200;
            if (t === "elastic") {
                i[n === "down" || n === "up" ? "top" : "left"] = (n === "up" || n === "left" ? "-" : "+") + "=" + o + "px";
            }
            e.wrap.animate(i, {
                duration: t === "none" ? 0 : e.prevSpeed,
                easing: e.prevEasing,
                complete: function() {
                    j(this).trigger("onReset").remove();
                }
            });
        }
    };
    M.helpers.overlay = {
        defaults: {
            closeClick: true,
            speedOut: 200,
            showEarly: true,
            css: {},
            locked: !l,
            fixed: true
        },
        overlay: null,
        fixed: false,
        el: j("html"),
        create: function(e) {
            var t;
            e = j.extend({}, this.defaults, e);
            if (this.overlay) {
                this.close();
            }
            t = M.coming ? M.coming.parent : e.parent;
            this.overlay = j('<div class="fancybox-overlay"></div>').appendTo(t && t.length ? t : "body");
            this.fixed = false;
            if (e.fixed && M.defaults.fixed) {
                this.overlay.addClass("fancybox-overlay-fixed");
                this.fixed = true;
            }
        },
        open: function(e) {
            var t = this;
            e = j.extend({}, this.defaults, e);
            if (this.overlay) {
                this.overlay.unbind(".overlay").width("auto").height("auto");
            } else {
                this.create(e);
            }
            if (!this.fixed) {
                a.bind("resize.overlay", j.proxy(this.update, this));
                this.update();
            }
            if (e.closeClick) {
                this.overlay.bind("click.overlay", function(e) {
                    if (j(e.target).hasClass("fancybox-overlay")) {
                        if (M.isActive) {
                            M.close();
                        } else {
                            t.close();
                        }
                        return false;
                    }
                });
            }
            this.overlay.css(e.css).show();
        },
        close: function() {
            a.unbind("resize.overlay");
            if (this.el.hasClass("fancybox-lock")) {
                j(".fancybox-margin").removeClass("fancybox-margin");
                this.el.removeClass("fancybox-lock");
                a.scrollTop(this.scrollV).scrollLeft(this.scrollH);
            }
            j(".fancybox-overlay").remove().hide();
            j.extend(this, {
                overlay: null,
                fixed: false
            });
        },
        update: function() {
            var e = "100%", t;
            this.overlay.width(e).height("100%");
            if (r) {
                t = Math.max(n.documentElement.offsetWidth, n.body.offsetWidth);
                if (f.width() > t) {
                    e = f.width();
                }
            } else if (f.width() > a.width()) {
                e = f.width();
            }
            this.overlay.width(e).height(f.height());
        },
        onReady: function(e, t) {
            var i = this.overlay;
            j(".fancybox-overlay").stop(true, true);
            if (!i) {
                this.create(e);
            }
            if (e.locked && this.fixed && t.fixed) {
                t.locked = this.overlay.append(t.wrap);
                t.fixed = false;
            }
            if (e.showEarly === true) {
                this.beforeShow.apply(this, arguments);
            }
        },
        beforeShow: function(e, t) {
            if (t.locked && !this.el.hasClass("fancybox-lock")) {
                if (this.fixPosition !== false) {
                    j("*").filter(function() {
                        return j(this).css("position") === "fixed" && !j(this).hasClass("fancybox-overlay") && !j(this).hasClass("fancybox-wrap");
                    }).addClass("fancybox-margin");
                }
                this.el.addClass("fancybox-margin");
                this.scrollV = a.scrollTop();
                this.scrollH = a.scrollLeft();
                this.el.addClass("fancybox-lock");
                a.scrollTop(this.scrollV).scrollLeft(this.scrollH);
            }
            this.open(e);
        },
        onUpdate: function() {
            if (!this.fixed) {
                this.update();
            }
        },
        afterClose: function(e) {
            if (this.overlay && !M.coming) {
                this.overlay.fadeOut(e.speedOut, j.proxy(this.close, this));
            }
        }
    };
    M.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(e) {
            var t = M.current, i = t.title, n = e.type, o, a;
            if (j.isFunction(i)) {
                i = i.call(t.element, t);
            }
            if (!h(i) || j.trim(i) === "") {
                return;
            }
            o = j('<div class="fancybox-title fancybox-title-' + n + '-wrap">' + i + "</div>");
            switch (n) {
              case "inside":
                a = M.skin;
                break;

              case "outside":
                a = M.wrap;
                break;

              case "over":
                a = M.inner;
                break;

              default:
                a = M.skin;
                o.appendTo("body");
                if (r) {
                    o.width(o.width());
                }
                o.wrapInner('<span class="child"></span>');
                M.current.margin[2] += Math.abs(I(o.css("margin-bottom")));
                break;
            }
            o[e.position === "top" ? "prependTo" : "appendTo"](a);
        }
    };
    j.fn.fancybox = function(a) {
        var r, s = j(this), l = this.selector || "", e = function(e) {
            var t = j(this).blur(), i = r, n, o;
            if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !t.is(".fancybox-wrap")) {
                n = a.groupAttr || "data-fancybox-group";
                o = t.attr(n);
                if (!o) {
                    n = "rel";
                    o = t.get(0)[n];
                }
                if (o && o !== "" && o !== "nofollow") {
                    t = l.length ? j(l) : s;
                    t = t.filter("[" + n + '="' + o + '"]');
                    i = t.index(this);
                }
                a.index = i;
                if (M.open(t, a) !== false) {
                    e.preventDefault();
                }
            }
        };
        a = a || {};
        r = a.index || 0;
        if (!l || a.live === false) {
            s.unbind("click.fb-start").bind("click.fb-start", e);
        } else {
            f.undelegate(l, "click.fb-start").delegate(l + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", e);
        }
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this;
    };
    f.ready(function() {
        var e, t;
        if (j.scrollbarWidth === p) {
            j.scrollbarWidth = function() {
                var e = j('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), t = e.children(), i = t.innerWidth() - t.height(99).innerWidth();
                e.remove();
                return i;
            };
        }
        if (j.support.fixedPosition === p) {
            j.support.fixedPosition = function() {
                var e = j('<div style="position:fixed;top:20px;"></div>').appendTo("body"), t = e[0].offsetTop === 20 || e[0].offsetTop === 15;
                e.remove();
                return t;
            }();
        }
        j.extend(M.defaults, {
            scrollbarWidth: j.scrollbarWidth(),
            fixed: j.support.fixedPosition,
            parent: j("body")
        });
        e = j(i).width();
        o.addClass("fancybox-lock-test");
        t = j(i).width();
        o.removeClass("fancybox-lock-test");
        j("<style type='text/css'>.fancybox-margin{margin-right:" + (t - e) + "px;}</style>").appendTo("head");
    });
})(window, document, jQuery);