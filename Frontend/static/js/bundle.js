var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(t,e){t.appendChild(e)}function l(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function f(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let i;function s(t){i=t}const d=[],p=[],m=[],g=[],h=Promise.resolve();let $=!1;function y(t){m.push(t)}let b=!1;const x=new Set;function _(){if(!b){b=!0;do{for(let t=0;t<d.length;t+=1){const e=d[t];s(e),v(e.$$)}for(d.length=0;p.length;)p.pop()();for(let t=0;t<m.length;t+=1){const e=m[t];x.has(e)||(x.add(e),e())}m.length=0}while(d.length);for(;g.length;)g.pop()();$=!1,b=!1,x.clear()}}function v(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(y)}}const w=new Set;function E(t,e){-1===t.$$.dirty[0]&&(d.push(t),$||($=!0,h.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function k(c,u,a,f,d,p,m=[-1]){const g=i;s(c);const h=u.props||{},$=c.$$={fragment:null,ctx:null,props:p,update:t,not_equal:d,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(g?g.$$.context:[]),callbacks:n(),dirty:m};let b=!1;if($.ctx=a?a(c,h,(t,e,...n)=>{const o=n.length?n[0]:e;return $.ctx&&d($.ctx[t],$.ctx[t]=o)&&($.bound[t]&&$.bound[t](o),b&&E(c,t)),e}):[],$.update(),b=!0,o($.before_update),$.fragment=!!f&&f($.ctx),u.target){if(u.hydrate){const t=function(t){return Array.from(t.childNodes)}(u.target);$.fragment&&$.fragment.l(t),t.forEach(l)}else $.fragment&&$.fragment.c();u.intro&&((x=c.$$.fragment)&&x.i&&(w.delete(x),x.i(v))),function(t,n,c){const{fragment:u,on_mount:l,on_destroy:a,after_update:f}=t.$$;u&&u.m(n,c),y(()=>{const n=l.map(e).filter(r);a?a.push(...n):o(n),t.$$.on_mount=[]}),f.forEach(y)}(c,u.target,u.anchor),_()}var x,v;s(g)}function A(e){let n,o,r,c;return{c(){var t,e,u;n=a("section"),o=a("div"),r=a("div"),c=a("h1"),c.textContent=`Hello ${C}!`,t="color",e="red",c.style.setProperty(t,e,u?"important":""),f(r,"class","text-center"),f(o,"class","container"),f(n,"class","page-section text-black mb-0"),f(n,"id","svelte")},m(t,e){!function(t,e,n){t.insertBefore(e,n||null)}(t,n,e),u(n,o),u(o,r),u(r,c)},p:t,i:t,o:t,d(t){t&&l(n)}}}let C="world";return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}{constructor(t){super(),k(this,t,null,A,c,{})}}({target:document.getElementById("appSvelte")})}();
//# sourceMappingURL=bundle.js.map