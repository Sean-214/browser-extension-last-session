!(function (c) {
  var e,
    d =
      '<svg><symbol id="icon-file" viewBox="0 0 1024 1024"><path d="M707.4810582 21.21481481H133.28253968v970.90370372h757.43492064V205.10137567L707.4810582 21.21481481z m3.90095239 48.32846562l129.59830687 131.11534391H711.38201059v-131.11534391z m152.78730158 896.02708994H160.04740741V46.46264551h520.23534391v185.29523809H864.16931217v733.81248677z"  ></path></symbol><symbol id="icon-close" viewBox="0 0 1024 1024"><path d="M883.93158744 183.99307561l-331.95149889 329.45419044 336.09938018 337.38620983-42.40018766 44.53203512L508.42347039 556.74737658l-329.73043028 337.51832508-43.78395799-43.18515375 331.09875907-338.89780643L135.0566389 179.09282736l42.39418174-44.53718258L509.55931275 468.88348858 842.71614211 138.23426255 883.93158744 183.99307561z"  ></path></symbol></svg>',
    t = (e = document.getElementsByTagName('script'))[e.length - 1].getAttribute('data-injectcss');
  if (t && !c.__iconfont__svg__cssinject__) {
    c.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function (e) {
    if (document.addEventListener)
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) setTimeout(e, 0);
      else {
        var t = function () {
          document.removeEventListener('DOMContentLoaded', t, !1), e();
        };
        document.addEventListener('DOMContentLoaded', t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = c.document),
        (l = !1),
        (d = function () {
          try {
            i.documentElement.doScroll('left');
          } catch (e) {
            return void setTimeout(d, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function () {
          'complete' == i.readyState && ((i.onreadystatechange = null), n());
        }));
    function n() {
      l || ((l = !0), o());
    }
    var o, i, l, d;
  })(function () {
    var e, t, n, o, i, l;
    ((e = document.createElement('div')).innerHTML = d),
      (d = null),
      (t = e.getElementsByTagName('svg')[0]) &&
        (t.setAttribute('aria-hidden', 'true'),
        (t.style.position = 'absolute'),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = 'hidden'),
        (n = t),
        (o = document.body).firstChild
          ? ((i = n), (l = o.firstChild).parentNode.insertBefore(i, l))
          : o.appendChild(n));
  });
})(window);
