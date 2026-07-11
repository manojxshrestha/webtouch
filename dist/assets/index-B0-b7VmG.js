var W=Object.defineProperty;var x=(e,p,f)=>p in e?W(e,p,{enumerable:!0,configurable:!0,writable:!0,value:f}):e[p]=f;var B=(e,p,f)=>x(e,typeof p!="symbol"?p+"":p,f);(function(){const p=document.createElement("link").relList;if(p&&p.supports&&p.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))b(c);new MutationObserver(c=>{for(const n of c)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&b(r)}).observe(document,{childList:!0,subtree:!0});function f(c){const n={};return c.integrity&&(n.integrity=c.integrity),c.referrerPolicy&&(n.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?n.credentials="include":c.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function b(c){if(c.ep)return;c.ep=!0;const n=f(c);fetch(c.href,n)}})();const $="modulepreload",O=function(e){return"/"+e},F={},U=function(p,f,b){let c=Promise.resolve();if(f&&f.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));c=Promise.allSettled(f.map(a=>{if(a=O(a),a in F)return;F[a]=!0;const t=a.endsWith(".css"),s=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${s}`))return;const i=document.createElement("link");if(i.rel=t?"stylesheet":$,t||(i.as="script"),i.crossOrigin="",i.href=a,o&&i.setAttribute("nonce",o),document.head.appendChild(i),t)return new Promise((m,h)=>{i.addEventListener("load",m),i.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${a}`)))})}))}function n(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return c.then(r=>{for(const o of r||[])o.status==="rejected"&&n(o.reason);return p().catch(n)})},H={threshold:127,minArea:10,maxArea:500,maxBlobs:50,resolutionScale:1,enableSkip:!0,outlineColor:"#ffffff",trailColor:"#ffffff",thickness:2,shapeStyle:"bracket",glowIntensity:0,drawTrails:!0,trailStyle:"smooth",trailColorMode:"solid",trailConnection:"spline",trailGlow:0,trailLength:10,trailFade:!0,showGrid:!1,showCornerMarks:!1,showTimestamp:!1,showCounter:!1,showTraceLine:!1,showVelocityText:!1,showBoundingBox:!1,motionSmoothing:.5,lineSmoothing:8,drawMirror:!1,drawKaleidoscope:!1,drawTileMirror:!1,drawFractal:!1,drawTunnel:!1,drawRippleMirror:!1,mirrorSegments:6,drawRGBSplit:!1,drawChromatic:!1,drawBlockGlitch:!1,drawVHS:!1,drawTear:!1,drawShift:!1,drawWave:!1,glitchOffset:5,drawInvert:!1,drawSolarize:!1,drawScanlines:!1,drawCRT:!1,drawGlitch:!1,drawInterference:!1,drawEdge:!1,drawThermal:!1,drawFeedback:!1,drawDuotone:!1,drawBloom:!1,drawFilmGrain:!1,drawColorShift:!1,drawPosterize:!1,drawPixelate:!1,drawQuantize:!1,drawThreshold:!1,drawBlur:!1,drawZoomBlur:!1,drawSharpen:!1,drawVignette:!1,drawNoise:!1,colorLevels:6,drawDateStamp:!1,drawLetterbox:!1,letterboxHeight:50,drawTrackingLines:!1,drawColorBleed:!1,colorBleedIntensity:3,drawStatic:!1,staticIntensity:10,drawJitter:!1,jitterAmount:5,drawColorBars:!1,drawCold:!1,drawWarm:!1,drawNoir:!1,drawSepia:!1,drawNeon:!1,neonColor:"#00ffff",drawLaser:!1,laserColor:"#ff0044",laserMidColor:"#00ff00",laserCornerColor:"#00ff00",laserWidth:2,laserThreshold:200,drawHologram:!1,drawMotionTrail:!1,motionTrailLength:10,drawStrobe:!1,strobeSpeed:5,drawMatrix:!1,drawLensFlare:!1,drawTwist:!1,twistAngle:30,drawFilmBurn:!1,drawDropShadow:!1,drawSparkle:!1,drawReflection:!1,drawFloorReflection:!1,drawGlass:!1};let P={...H};function R(){return P}function E(e){P={...P,...e}}function z(e){const{width:p,height:f,data:b}=e,c=R(),n=new Uint8Array(p*f);for(let t=0;t<b.length;t+=4)n[t/4]=(b[t]+b[t+1]+b[t+2])/3>c.threshold?1:0;const r=new Int32Array(p*f);let o=0;const a=[];for(let t=0;t<f;t++)for(let s=0;s<p;s++){const i=t*p+s;if(n[i]===1&&r[i]===0){o++;const m=N(n,r,p,f,s,t,o);m.area>=c.minArea&&m.area<=c.maxArea&&a.push(m)}}return a.sort((t,s)=>s.area-t.area),a.slice(0,c.maxBlobs)}function N(e,p,f,b,c,n,r){const o=[[c,n]];let a=0,t=0,s=0,i=c,m=c,h=n,d=n;for(;o.length>0;){const[l,u]=o.pop(),v=u*f+l;l<0||l>=f||u<0||u>=b||e[v]!==1||p[v]!==0||(p[v]=r,a++,t+=l,s+=u,i=Math.min(i,l),m=Math.max(m,l),h=Math.min(h,u),d=Math.max(d,u),o.push([l+1,u],[l-1,u],[l,u+1],[l,u-1]))}return{x:t/a,y:s/a,area:a,minX:i,maxX:m,minY:h,maxY:d,width:m-i,height:d-h}}function j(e,p){return Math.sqrt((p.x-e.x)**2+(p.y-e.y)**2)}function X(e,p){if(p.length===0)return e;const f=[],b=new Set;for(const c of e){let n=null,r=1/0;for(let o=0;o<p.length;o++){if(b.has(o))continue;const a=p[o],t=j(c,a);t<r&&t<100&&(r=t,n=o)}if(n!==null){b.add(n);const o=p[n],a=.3;f.push({...c,x:a*c.x+(1-a)*o.x,y:a*c.y+(1-a)*o.y,vx:c.x-o.x||0,vy:c.y-o.y||0,id:o.id})}else f.push({...c,vx:0,vy:0,id:Math.random()})}return f}function A(e){const p=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return p?{r:parseInt(p[1],16),g:parseInt(p[2],16),b:parseInt(p[3],16)}:{r:0,g:0,b:0}}function Y(e,p){if(e.length<4)return e;const f=[],b=[[0,2,0,0],[-1,0,1,0],[2,-5,4,-1],[-1,3,-3,1]];for(let c=1;c<e.length-2;c++){const n=[e[c-1],e[c],e[c+1],e[c+2]];for(let r=0;r<p;r++){const o=r/p,a=o*o,t=a*o,s=[1,o,a,t];let i=0,m=0;for(let h=0;h<4;h++){let d=0,l=0;for(let u=0;u<4;u++)d+=b[h][u]*n[u].x,l+=b[h][u]*n[u].y;i+=.5*s[h]*d,m+=.5*s[h]*l}f.push({x:Math.round(i),y:Math.round(m)})}}return f}function q(e,p,f,b,c,n,r){const o=Math.min(b,c)*.3;e.strokeStyle=n,e.lineWidth=r,e.beginPath(),e.moveTo(p,f+o),e.lineTo(p,f),e.lineTo(p+o,f),e.stroke(),e.beginPath(),e.moveTo(p+b-o,f),e.lineTo(p+b,f),e.lineTo(p+b,f+o),e.stroke(),e.beginPath(),e.moveTo(p,f+c-o),e.lineTo(p,f+c),e.lineTo(p+o,f+c),e.stroke(),e.beginPath(),e.moveTo(p+b-o,f+c),e.lineTo(p+b,f+c),e.lineTo(p+b,f+c-o),e.stroke()}function V(e,p,f){let b,c,n;{const r=(t,s,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<.16666666666666666?t+(s-t)*6*i:i<.5?s:i<.6666666666666666?t+(s-t)*(.6666666666666666-i)*6:t),o=f+p-f*p,a=2*f-o;b=r(a,o,e+1/3),c=r(a,o,e),n=r(a,o,e-1/3)}return`rgb(${Math.round(b*255)},${Math.round(c*255)},${Math.round(n*255)})`}function _(e,p,f,b){const c=`rgb(${b.r},${b.g},${b.b})`;if(f.trailStyle==="neon"&&(e.shadowBlur=f.trailGlow||10,e.shadowColor=c),f.trailStyle==="dots"){p.forEach((r,o)=>{const a=o/p.length*360;let t=c;f.trailColorMode==="rainbow"&&(t=V(a/360,1,.5)),e.beginPath(),e.arc(r.x,r.y,3,0,Math.PI*2),e.fillStyle=t,e.fill()}),e.shadowBlur=0;return}let n=p.map(r=>({x:r.x,y:r.y}));if(f.trailConnection==="spline"&&n.length>=4&&(n=Y(n,f.trailLength)),n.length>=2)if(f.trailColorMode==="rainbow")for(let r=0;r<n.length-1;r++){const o=r/n.length*360,a=V(o/360,1,.5);e.strokeStyle=a,e.lineWidth=2,e.beginPath(),e.moveTo(n[r].x,n[r].y),e.lineTo(n[r+1].x,n[r+1].y),e.stroke()}else if(f.trailFade)for(let r=0;r<n.length-1;r++){const o=(r+1)/n.length;e.strokeStyle=`rgba(${b.r},${b.g},${b.b},${o})`,e.lineWidth=2,e.beginPath(),e.moveTo(n[r].x,n[r].y),e.lineTo(n[r+1].x,n[r+1].y),e.stroke()}else{e.strokeStyle=c,e.lineWidth=2,e.beginPath(),e.moveTo(n[0].x,n[0].y);for(let r=1;r<n.length;r++)e.lineTo(n[r].x,n[r].y);e.stroke()}e.shadowBlur=0}function J(e,p,f){e.fillStyle="rgba(0,0,0,0.15)";for(let b=0;b<f;b+=3)e.fillRect(0,b,p,1)}function Z(e,p,f){const b=e.getImageData(0,0,p,f),c=b.data,n=3+Math.floor(Math.random()*5);for(let r=0;r<n;r++){const o=Math.floor(Math.random()*f),a=1+Math.floor(Math.random()*10),t=Math.floor((Math.random()-.5)*20);for(let s=o;s<Math.min(o+a,f);s++)for(let i=0;i<p;i++){const m=(s*p+i)*4,h=(s*p+(i+t+p)%p)*4;c[m]=c[h],c[m+1]=c[h+1],c[m+2]=c[h+2]}}e.putImageData(b,0,0)}function K(e,p,f){const b=e.getImageData(0,0,p,f),c=b.data;for(let n=0;n<f;n+=2+Math.floor(Math.random()*4)){const r=Math.random()>.5?255:0,o=Math.random()*.3;for(let a=0;a<p;a++){const t=(n*p+a)*4;c[t]=Math.floor(c[t]*(1-o)+r*o),c[t+1]=Math.floor(c[t+1]*(1-o)+r*o),c[t+2]=Math.floor(c[t+2]*(1-o)+r*o)}}e.putImageData(b,0,0)}function Q(e,p,f,b){const c=R(),{width:n,height:r}=p;if(c.drawMirror&&(e.save(),e.scale(-1,1),e.drawImage(p,-n,0),e.restore(),e.drawImage(p,0,0)),c.drawKaleidoscope){const o=c.mirrorSegments,a=Math.PI*2/o;e.save(),e.translate(n/2,r/2);for(let t=0;t<o;t++)e.save(),e.rotate(a*t),e.beginPath(),e.moveTo(0,0),e.lineTo(n,0),e.lineTo(n,r),e.closePath(),e.clip(),e.scale(1,1),e.translate(t%2===0?0:-n/2,0),e.drawImage(p,0,0),e.restore();e.restore()}if(c.drawTileMirror){const o=c.mirrorSegments,a=n/o,t=document.createElement("canvas");t.width=n,t.height=r,t.getContext("2d").drawImage(p,0,0),e.save();for(let i=0;i<2;i++)for(let m=0;m<o;m++)e.save(),e.translate(m*a,i*r/2),(m+i)%2===1&&e.scale(-1,1),e.drawImage(t,-m*a,-i*r/2),e.restore();e.restore()}if(c.drawRGBSplit){const o=c.glitchOffset,a=e.getImageData(0,0,n,r),t=a.data,s=new Uint8ClampedArray(t);for(let i=0;i<r;i++)for(let m=0;m<n;m++){const h=(i*n+m)*4,d=(i*n+Math.min(m+o,n-1))*4,l=(i*n+Math.max(m-o,0))*4;t[d]=s[h],t[l+2]=s[h+2]}e.putImageData(a,0,0)}if(c.drawBlockGlitch){const o=3+Math.floor(Math.random()*4);for(let a=0;a<o;a++){const t=30+Math.random()*100,s=5+Math.random()*40,i=Math.random()*(n-t),m=Math.random()*(r-s),h=(Math.random()-.5)*c.glitchOffset*4;try{const d=e.getImageData(i,m,t,s);e.putImageData(d,Math.max(0,Math.min(n-t,i+h)),m)}catch{}}}if(c.drawWave){const o=Date.now()*.003,a=c.glitchOffset*2,t=.015,s=e.getImageData(0,0,n,r),i=s.data,m=new Uint8ClampedArray(i);for(let h=0;h<r;h++){const d=Math.sin(h*t+o)*a;for(let l=0;l<n;l++){const u=Math.min(Math.max(Math.floor(l+d),0),n-1),v=(h*n+u)*4,g=(h*n+l)*4;i[g]=m[v],i[g+1]=m[v+1],i[g+2]=m[v+2]}}e.putImageData(s,0,0)}if(c.drawEdge){const o=e.getImageData(0,0,n,r),a=o.data,t=new Uint8ClampedArray(a.length);for(let s=1;s<r-1;s++)for(let i=1;i<n-1;i++){const m=(s*n+i)*4,h=(s*n+i-1)*4,d=(s*n+i+1)*4,l=((s-1)*n+i)*4,u=((s+1)*n+i)*4,v=Math.abs(a[d]-a[h]),g=Math.abs(a[u]-a[l]),w=Math.min(255,v+g);t[m]=t[m+1]=t[m+2]=w,t[m+3]=255}for(let s=0;s<a.length;s++)a[s]=t[s];e.putImageData(o,0,0)}if(c.drawThermal){const o=e.getImageData(0,0,n,r),a=o.data;for(let t=0;t<a.length;t+=4){const s=(a[t]+a[t+1]+a[t+2])/3,i=Math.floor(s/255*255);i<64?(a[t]=0,a[t+1]=0,a[t+2]=Math.floor(255*(i/64))):i<128?(a[t]=0,a[t+1]=Math.floor(255*((i-64)/64)),a[t+2]=255-Math.floor(255*((i-64)/64))):i<192?(a[t]=Math.floor(255*((i-128)/64)),a[t+1]=255,a[t+2]=0):(a[t]=255,a[t+1]=255-Math.floor(255*((i-192)/63)),a[t+2]=0)}e.putImageData(o,0,0)}if(c.drawFeedback&&f&&b&&((f.width!==n||f.height!==r)&&(f.width=n,f.height=r),b.globalAlpha=.7,b.drawImage(p,0,0),e.drawImage(f,0,0)),c.drawPosterize){const a=255/c.colorLevels,t=e.getImageData(0,0,n,r),s=t.data;for(let i=0;i<s.length;i+=4)s[i]=Math.floor(s[i]/a)*a,s[i+1]=Math.floor(s[i+1]/a)*a,s[i+2]=Math.floor(s[i+2]/a)*a;e.putImageData(t,0,0)}if(c.drawPixelate){const o=c.colorLevels,a=e.getImageData(0,0,n,r),t=a.data;for(let s=0;s<r;s+=o)for(let i=0;i<n;i+=o){const m=(s*n+i)*4;for(let h=0;h<o&&s+h<r;h++)for(let d=0;d<o&&i+d<n;d++){const l=((s+h)*n+(i+d))*4;t[l]=t[m],t[l+1]=t[m+1],t[l+2]=t[m+2]}}e.putImageData(a,0,0)}if(c.drawRippleMirror){const o=e.getImageData(0,0,n,r),a=o.data,t=new Uint8ClampedArray(a),s=Date.now()*.002;for(let i=0;i<r;i++)for(let m=0;m<n;m++){const h=m-n/2,d=i-r/2,l=Math.sqrt(h*h+d*d),u=Math.sin(l*.05-s)*10,v=Math.min(Math.max(Math.floor(m+u),0),n-1),g=(i*n+v)*4,w=(i*n+m)*4;a[w]=t[g],a[w+1]=t[g+1],a[w+2]=t[g+2]}e.putImageData(o,0,0)}if(c.drawTunnel){const o=c.mirrorSegments,a=document.createElement("canvas");a.width=n,a.height=r,a.getContext("2d").drawImage(p,0,0),e.save(),e.translate(n/2,r/2);for(let s=0;s<o;s++){const i=1-s/o*.8,m=1-s/o*.9;e.globalAlpha=m,e.save(),e.scale(i,i),e.drawImage(a,-n/2,-r/2),e.restore()}e.restore()}if(c.drawFractal){const o=c.mirrorSegments,a=Math.PI*2/o,t=document.createElement("canvas");t.width=n,t.height=r,t.getContext("2d").drawImage(p,0,0),e.save(),e.translate(n/2,r/2);for(let i=0;i<o;i++)e.save(),e.rotate(a*i),e.scale(.5,.5),e.drawImage(t,-n/2,-r/2),e.scale(-1,1),e.drawImage(t,-n/2,-r/2),e.restore();e.restore()}if(c.drawChromatic){const o=c.glitchOffset*2,a=e.getImageData(0,0,n,r),t=a.data,s=new Uint8ClampedArray(t);for(let i=0;i<r;i++)for(let m=0;m<n;m++){const h=(i*n+m)*4,d=(i*n+Math.min(m+o,n-1))*4,l=(i*n+m)*4,u=(i*n+Math.max(m-o,0))*4;t[d]=s[h],t[l+1]=s[l+1],t[u+2]=s[u+2]}e.putImageData(a,0,0)}if(c.drawVHS){const o=e.getImageData(0,0,n,r),a=o.data;for(let t=0;t<r;t++)if(Math.random()<.1){const s=Math.floor(Math.random()*20-10);for(let i=0;i<n;i++){const m=Math.max(0,Math.min(n-1,i+s)),h=(t*n+m)*4,d=(t*n+i)*4;a[d]=a[h],a[d+1]=a[h+1],a[d+2]=a[h+2]}}e.putImageData(o,0,0),e.fillStyle="rgba(255,255,255,0.03)";for(let t=0;t<r;t+=3)e.fillRect(0,t,n,1)}if(c.drawTear){const o=Math.floor(Math.random()*r),a=5+Math.random()*20,t=e.getImageData(0,o,n,a);e.putImageData(t,0,o+(Math.random()-.5)*50)}if(c.drawShift){const o=3+Math.floor(Math.random()*5);for(let a=0;a<o;a++){const t=Math.floor(Math.random()*r),s=5+Math.floor(Math.random()*20),i=(Math.random()-.5)*c.glitchOffset*3,m=e.getImageData(0,t,n,s);e.putImageData(m,i,t)}}if(c.drawSolarize){const o=e.getImageData(0,0,n,r),a=o.data;for(let t=0;t<a.length;t+=4)a[t]=a[t]>127?255-a[t]:a[t],a[t+1]=a[t+1]>127?255-a[t+1]:a[t+1],a[t+2]=a[t+2]>127?255-a[t+2]:a[t+2];e.putImageData(o,0,0)}if(c.drawCRT){e.fillStyle="rgba(0,0,0,0.1)",e.fillRect(0,0,n,r);for(let a=0;a<r;a+=2)e.fillStyle="rgba(0,0,0,0.3)",e.fillRect(0,a,n,1);e.save(),e.globalCompositeOperation="multiply";const o=e.createRadialGradient(n/2,r/2,0,n/2,r/2,Math.max(n,r));o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(.7,"rgba(255,255,255,0)"),o.addColorStop(1,"rgba(255,255,255,0.3)"),e.fillStyle=o,e.fillRect(0,0,n,r),e.restore()}if(c.drawDuotone){const o=e.getImageData(0,0,n,r),a=o.data,t={r:65,g:105,b:225},s={r:255,g:20,b:147};for(let i=0;i<a.length;i+=4){const m=(a[i]*.299+a[i+1]*.587+a[i+2]*.114)/255,h=t.r+(s.r-t.r)*m,d=t.g+(s.g-t.g)*m,l=t.b+(s.b-t.b)*m;a[i]=h,a[i+1]=d,a[i+2]=l}e.putImageData(o,0,0)}if(c.drawBloom){const o=c.glowIntensity||5,a=document.createElement("canvas");a.width=Math.floor(n/4),a.height=Math.floor(r/4);const t=a.getContext("2d");t.drawImage(p,0,0,a.width,a.height),t.filter=`blur(${o}px)`,t.drawImage(a,0,0),t.filter="none",e.save(),e.globalCompositeOperation="screen",e.globalAlpha=.6,e.drawImage(a,0,0,n,r),e.restore()}if(c.drawFilmGrain){const o=e.getImageData(0,0,n,r),a=o.data,t=c.colorLevels*2;for(let s=0;s<a.length;s+=4){const i=(Math.random()-.5)*t;a[s]=Math.max(0,Math.min(255,a[s]+i)),a[s+1]=Math.max(0,Math.min(255,a[s+1]+i)),a[s+2]=Math.max(0,Math.min(255,a[s+2]+i))}e.putImageData(o,0,0),e.fillStyle="rgba(255, 248, 220, 0.05)",e.fillRect(0,0,n,r)}if(c.drawColorShift){const a=e.getImageData(0,0,n,r),t=a.data;for(let s=0;s<t.length;s+=4){let i=t[s]/255,m=t[s+1]/255,h=t[s+2]/255;const d=Math.max(i,m,h),l=Math.min(i,m,h);let u=0,v=0,g=(d+l)/2;if(d!==l){const C=d-l;switch(v=g>.5?C/(2-d-l):C/(d+l),d){case i:u=((m-h)/C+(m<h?6:0))/6;break;case m:u=((h-i)/C+2)/6;break;case h:u=((i-m)/C+4)/6;break}}u=(u+30/360)%1;let w,y,k;if(v===0)w=y=k=g;else{const C=(T,I,S)=>(S<0&&(S+=1),S>1&&(S-=1),S<.16666666666666666?T+(I-T)*6*S:S<.5?I:S<.6666666666666666?T+(I-T)*(.6666666666666666-S)*6:T),M=g<.5?g*(1+v):g+v-g*v,D=2*g-M;w=C(D,M,u+1/3),y=C(D,M,u),k=C(D,M,u-1/3)}t[s]=w*255,t[s+1]=y*255,t[s+2]=k*255}e.putImageData(a,0,0)}if(c.drawQuantize){const a=255/c.colorLevels,t=e.getImageData(0,0,n,r),s=t.data;for(let i=0;i<s.length;i+=4)s[i]=Math.floor(s[i]/a)*a,s[i+1]=Math.floor(s[i+1]/a)*a,s[i+2]=Math.floor(s[i+2]/a)*a;e.putImageData(t,0,0)}if(c.drawThreshold){const a=e.getImageData(0,0,n,r),t=a.data;for(let s=0;s<t.length;s+=4){const m=t[s]*.299+t[s+1]*.587+t[s+2]*.114>128?255:0;t[s]=t[s+1]=t[s+2]=m}e.putImageData(a,0,0)}if(c.drawBlur){const o=c.colorLevels;e.save(),e.filter=`blur(${o}px)`,e.drawImage(p,0,0),e.restore()}if(c.drawZoomBlur){const o=n/2,a=r/2,t=c.colorLevels,s=e.getImageData(0,0,n,r),i=s.data,m=new Uint8ClampedArray(i);for(let h=0;h<r;h++)for(let d=0;d<n;d++){const l=d-o,u=h-a,v=Math.sqrt(l*l+u*u),g=Math.min(t,v*.1),w=Math.floor(o+l*(1-g/v)),y=Math.floor(a+u*(1-g/v));if(w>=0&&w<n&&y>=0&&y<r){const k=(h*n+d)*4,C=(y*n+w)*4;i[k]=m[C],i[k+1]=m[C+1],i[k+2]=m[C+2]}}e.putImageData(s,0,0)}if(c.drawSharpen){const o=e.getImageData(0,0,n,r),a=o.data,t=new Uint8ClampedArray(a),s=[0,-1,0,-1,5,-1,0,-1,0];for(let i=1;i<r-1;i++)for(let m=1;m<n-1;m++)for(let h=0;h<3;h++){let d=0;for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++){const g=(u+1)*3+(v+1),w=((i+u)*n+(m+v))*4+h;d+=a[w]*s[g]}const l=(i*n+m)*4+h;t[l]=Math.max(0,Math.min(255,d))}for(let i=0;i<a.length;i++)a[i]=t[i];e.putImageData(o,0,0)}if(c.drawDateStamp){const o=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],a=new Date,t=`${o[a.getMonth()]} ${String(a.getDate()).padStart(2,"0")} ${a.getFullYear()}`,s=`${String(a.getHours()).padStart(2,"0")}:${String(a.getMinutes()).padStart(2,"0")}:${String(a.getSeconds()).padStart(2,"0")}`;e.font="16px monospace",e.fillStyle="#ffff00",e.fillText(`${t} ${s}`,20,r-30),e.fillStyle="#ffffff",e.fillText(`${t} ${s}`,22,r-28)}if(c.drawLetterbox){const o=c.letterboxHeight||50;e.fillStyle="#000000",e.fillRect(0,0,n,o),e.fillRect(0,r-o,n,o)}if(c.drawTrackingLines)for(let o=0;o<r;o+=3)Math.random()<.3&&(e.fillStyle="rgba(255,255,255,0.5)",e.fillRect(0,o,n,1)),Math.random()<.2&&(e.fillStyle="rgba(0,0,0,0.3)",e.fillRect(0,o+1,n,1));if(c.drawColorBleed){const o=e.getImageData(0,0,n,r),a=o.data,t=new Uint8ClampedArray(a);for(let s=1;s<r-1;s++)for(let i=1;i<n-1;i++){const m=(s*n+i)*4,h=(s*n+i-1)*4,d=(s*n+i+1)*4;for(let l=0;l<3;l++)a[m+l]=(t[m+l]*2+t[h+l]+t[d+l])/4}e.putImageData(o,0,0)}if(c.drawStatic){const o=c.staticIntensity||10,a=e.getImageData(0,0,n,r),t=a.data;for(let s=0;s<t.length;s+=4){const i=(Math.random()-.5)*o*5;t[s]=Math.max(0,Math.min(255,t[s]+i)),t[s+1]=Math.max(0,Math.min(255,t[s+1]+i)),t[s+2]=Math.max(0,Math.min(255,t[s+2]+i))}e.putImageData(a,0,0)}if(c.drawJitter){const o=c.jitterAmount||5,a=(Math.random()-.5)*o,t=(Math.random()-.5)*o,s=e.getImageData(0,0,n,r);e.putImageData(s,a,t)}if(c.drawColorBars){const o=n/7,a=[[255,255,255],[255,255,0],[0,255,255],[0,255,0],[255,0,255],[0,0,255],[255,0,0]];e.save();for(let t=0;t<7;t++)e.fillStyle=`rgb(${a[t][0]},${a[t][1]},${a[t][2]})`,e.fillRect(t*o,0,o,r);e.restore()}}function ee(e,p,f,b,c,n,r){const o=R(),{width:a,height:t}=p,s=A(o.outlineColor),i=A(o.trailColor),m=`rgb(${s.r},${s.g},${s.b})`;if(Q(e,p,n,r),o.drawReflection){const h=e.getImageData(0,0,a,t);e.save(),e.scale(1,-1),e.globalAlpha=.3,e.drawImage(p,0,-t*2),e.restore(),e.putImageData(h,0,0);const d=e.createLinearGradient(0,t*.6,0,t);d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(1,"rgba(0,0,0,0.5)"),e.fillStyle=d,e.fillRect(0,t*.6,a,t*.4)}if(o.drawFloorReflection){const h=e.getImageData(0,0,a,t),d=h.data,l=new Uint8ClampedArray(d),u=t/2;for(let v=0;v<u;v++)for(let g=0;g<a;g++){const w=((t-1-v)*a+g)*4,y=(v*a+g)*4,k=v/u*.4;d[w]=l[y]*k,d[w+1]=l[y+1]*k,d[w+2]=l[y+2]*k}e.putImageData(h,0,0)}if(o.drawGlass){const h=e.createRadialGradient(a/2,t/2,0,a/2,t/2,Math.max(a,t));h.addColorStop(0,"rgba(255,255,255,0)"),h.addColorStop(.5,"rgba(255,255,255,0.1)"),h.addColorStop(1,"rgba(200,220,255,0.2)"),e.fillStyle=h,e.fillRect(0,0,a,t),e.fillStyle="rgba(255,255,255,0.02)";for(let d=0;d<t;d+=2)e.fillRect(0,d,a,1)}if(o.drawCold){const h=e.getImageData(0,0,a,t),d=h.data;for(let l=0;l<d.length;l+=4)d[l]=Math.max(0,d[l]-30),d[l+1]=Math.max(0,d[l+1]-10),d[l+2]=Math.min(255,d[l+2]+40);e.putImageData(h,0,0)}if(o.drawWarm){const h=e.getImageData(0,0,a,t),d=h.data;for(let l=0;l<d.length;l+=4)d[l]=Math.min(255,d[l]+40),d[l+1]=Math.max(0,d[l+1]-10),d[l+2]=Math.max(0,d[l+2]-30);e.putImageData(h,0,0)}if(o.drawNoir){const h=e.getImageData(0,0,a,t),d=h.data;for(let l=0;l<d.length;l+=4){const u=d[l]*.299+d[l+1]*.587+d[l+2]*.114,v=u>100?255:u*.5;d[l]=d[l+1]=d[l+2]=v}e.putImageData(h,0,0)}if(o.drawSepia){const h=e.getImageData(0,0,a,t),d=h.data;for(let l=0;l<d.length;l+=4){const u=d[l],v=d[l+1],g=d[l+2];d[l]=Math.min(255,u*.393+v*.769+g*.189),d[l+1]=Math.min(255,u*.349+v*.686+g*.168),d[l+2]=Math.min(255,u*.272+v*.534+g*.131)}e.putImageData(h,0,0)}if(o.drawNeon&&f.length>0&&(e.save(),e.shadowColor=o.neonColor||"#00ffff",e.shadowBlur=15,e.strokeStyle=o.neonColor||"#00ffff",e.lineWidth=o.thickness,f.forEach(h=>{const d=Math.min(h.width,h.height)/2;e.beginPath(),e.arc(h.x,h.y,d,0,Math.PI*2),e.stroke()}),e.restore()),o.drawLaser&&f.length>=2){const h=o.laserColor||"#ff0044",d=o.laserMidColor||"#00ff00",l=o.laserCornerColor||"#00ff00",u=o.laserThreshold||200,v=o.laserWidth||2;e.save(),e.strokeStyle=h,e.lineWidth=v,e.shadowColor=h,e.shadowBlur=15;const g=new Array(f.length).fill(!1);for(let w=0;w<f.length;w++){let y=1/0,k=-1;for(let C=w+1;C<f.length;C++){const M=Math.sqrt((f[C].x-f[w].x)**2+(f[C].y-f[w].y)**2);M<u&&M<y&&(y=M,k=C)}if(k!==-1){g[w]=!0,g[k]=!0,e.globalAlpha=1-y/u,e.beginPath(),e.moveTo(f[w].x,f[w].y),e.lineTo(f[k].x,f[k].y),e.stroke();const C=(f[w].x+f[k].x)/2,M=(f[w].y+f[k].y)/2;e.globalAlpha=.3,e.fillStyle=d,e.shadowColor=d,e.beginPath(),e.arc(C,M,v*3,0,Math.PI*2),e.fill()}}for(let w=0;w<f.length;w++)g[w]&&(e.globalAlpha=.8,e.fillStyle=l,e.shadowColor=l,e.beginPath(),e.arc(f[w].x,f[w].y,v*2,0,Math.PI*2),e.fill());e.restore()}if(o.drawHologram){const h=e.getImageData(0,0,a,t),d=h.data,l=new Uint8ClampedArray(d);for(let u=0;u<t;u++){const v=Math.sin(u*.1)*3;for(let g=0;g<a;g++){const w=Math.floor(g+v);if(w>=0&&w<a){const y=(u*a+w)*4,k=(u*a+g)*4;d[k+2]=l[y+2]}}}e.putImageData(h,0,0);for(let u=0;u<t;u+=4)e.fillStyle="rgba(0, 255, 255, 0.1)",e.fillRect(0,u,a,1)}if(o.drawStrobe){const h=o.strobeSpeed||5;Math.floor(Date.now()/(100/h))%2===0&&(e.fillStyle="rgba(255, 255, 255, 0.3)",e.fillRect(0,0,a,t))}if(o.drawMotionTrail&&f.length>0){const h=o.motionTrailLength||10,d=o.laserColor||"#ff0044";f.forEach(l=>{if(l.vx!==void 0&&l.vy!==void 0){e.save(),e.strokeStyle=d,e.lineWidth=1;for(let u=0;u<h;u++){const v=1-u/h;e.globalAlpha=v*.5;const g=l.x-(l.vx||0)*u*2,w=l.y-(l.vy||0)*u*2;e.beginPath(),e.arc(g,w,3,0,Math.PI*2),e.stroke()}e.restore()}})}if(o.drawMatrix){const h=Math.floor(a/12),d=new Array(h).fill(0);e.fillStyle="rgba(0, 0, 0, 0.05)",e.fillRect(0,0,a,t),e.font="12px monospace";for(let l=0;l<d.length;l++)if(Math.random()<.02){const u=String.fromCharCode(33+Math.floor(Math.random()*94)),v=Math.floor(Math.random()*155)+100;e.fillStyle=`rgb(0, ${v}, 0)`,e.fillText(u,l*12,d[l]*12),d[l]*12>t&&(d[l]=0),d[l]++}}if(o.drawLensFlare){const h=Date.now()*.001;e.save(),e.globalCompositeOperation="screen";for(let d=0;d<t;d+=150){const l=Math.sin(h+d*.01)*20,u=e.createLinearGradient(0,d+l,a,d+l);u.addColorStop(0,"rgba(255, 200, 100, 0)"),u.addColorStop(.3,"rgba(255, 200, 100, 0.1)"),u.addColorStop(.5,"rgba(255, 255, 255, 0.15)"),u.addColorStop(.7,"rgba(255, 200, 100, 0.1)"),u.addColorStop(1,"rgba(255, 200, 100, 0)"),e.fillStyle=u,e.fillRect(0,d+l-10,a,20)}e.restore()}if(o.drawTwist){const h=(o.twistAngle||30)*Math.PI/180,d=e.getImageData(0,0,a,t),l=d.data,u=new Uint8ClampedArray(l),v=a/2,g=t/2;for(let w=0;w<t;w++)for(let y=0;y<a;y++){const k=y-v,C=w-g,M=Math.sqrt(k*k+C*C),D=Math.atan2(C,k)+h*(M/200),T=Math.floor(v+M*Math.cos(D)),I=Math.floor(g+M*Math.sin(D));if(T>=0&&T<a&&I>=0&&I<t){const S=(w*a+y)*4,L=(I*a+T)*4;l[S]=u[L],l[S+1]=u[L+1],l[S+2]=u[L+2]}}e.putImageData(d,0,0)}if(o.drawFilmBurn){const h=Date.now()*.001,d=t*.7+Math.sin(h*2)*50,l=e.createLinearGradient(0,d,0,t);l.addColorStop(0,"rgba(255, 100, 0, 0)"),l.addColorStop(.3,"rgba(255, 100, 0, 0.3)"),l.addColorStop(.6,"rgba(255, 50, 0, 0.6)"),l.addColorStop(1,"rgba(0, 0, 0, 0.9)"),e.fillStyle=l,e.fillRect(0,d,a,t-d)}if(o.drawDropShadow&&f.length>0&&(e.save(),f.forEach(d=>{const l=Math.min(d.width,d.height)/2;e.fillStyle="rgba(0, 0, 0, 0.5)",e.beginPath(),e.arc(d.x+5,d.y+5,l,0,Math.PI*2),e.fill()}),e.restore()),o.drawSparkle){const d=e.getImageData(0,0,a,t).data;for(let l=0;l<d.length;l+=4)if((d[l]+d[l+1]+d[l+2])/3>200&&Math.random()<.01){const v=l/4%a,g=Math.floor(l/4/a);e.save(),e.strokeStyle="rgba(255, 255, 255, 0.8)",e.lineWidth=1,e.beginPath(),e.moveTo(v-5,g),e.lineTo(v+5,g),e.moveTo(v,g-5),e.lineTo(v,g+5),e.stroke(),e.beginPath(),e.arc(v,g,2,0,Math.PI*2),e.fillStyle="rgba(255, 255, 255, 0.9)",e.fill(),e.restore()}}if(o.showGrid){e.strokeStyle=`rgba(${s.r},${s.g},${s.b},0.3)`,e.lineWidth=1;for(let h=0;h<a;h+=50)e.beginPath(),e.moveTo(h,0),e.lineTo(h,t),e.stroke();for(let h=0;h<t;h+=50)e.beginPath(),e.moveTo(0,h),e.lineTo(a,h),e.stroke()}o.drawTrails&&f.length>=2&&_(e,f,o,i),f.forEach(h=>{const{minX:d,minY:l,width:u,height:v,x:g,y:w}=h,y=Math.min(u,v)/2;let k=m;switch(o.glowIntensity>0&&(e.shadowColor=k,e.shadowBlur=o.glowIntensity),o.shapeStyle){case"concentric":ae(e,g,w,y,k);break;case"bracket":q(e,d,l,u,v,k,o.thickness);break;case"rect":e.strokeStyle=k,e.lineWidth=o.thickness,e.strokeRect(d,l,u,v);break;case"crosshair":e.strokeStyle=k,e.lineWidth=o.thickness;const C=y*.8;e.beginPath(),e.moveTo(g-C,w),e.lineTo(g+C,w),e.moveTo(g,w-C),e.lineTo(g,w+C),e.stroke(),e.beginPath(),e.arc(g,w,C*.7,0,Math.PI*2),e.stroke();break;case"inner":e.strokeStyle=k,e.lineWidth=o.thickness,e.beginPath(),e.arc(g,w,y*.6,0,Math.PI*2),e.stroke();break;case"ring":e.strokeStyle=k,e.lineWidth=o.thickness,e.beginPath(),e.arc(g,w,y*.8,0,Math.PI*2),e.stroke();break;case"diamond":e.strokeStyle=k,e.lineWidth=o.thickness,e.beginPath(),e.moveTo(g,w-y),e.lineTo(g+y,w),e.lineTo(g,w+y),e.lineTo(g-y,w),e.closePath(),e.stroke();break;case"pulse":const M=Math.sin(Date.now()*.005)*.3+.7;e.strokeStyle=k,e.lineWidth=o.thickness,e.beginPath(),e.arc(g,w,y*M,0,Math.PI*2),e.stroke();break;case"retroframe":e.save(),e.strokeStyle=k,e.lineWidth=o.thickness*2;const D=u*1.1,T=v*1.1,I=(D-u)/2;e.strokeRect(d-I,l-I,D,T),e.lineWidth=o.thickness,e.strokeRect(d-I-4,l-I-4,D+8,T+8),e.fillStyle=k;const S=8;e.fillRect(d-I-S,l-I-S,S,S),e.fillRect(d+D+I,l-I-S,S,S),e.fillRect(d-I-S,l+T+I,S,S),e.fillRect(d+D+I,l+T+I,S,S),e.restore();break}if(e.shadowBlur=0,o.showVelocityText){const C=Math.sqrt((h.vx||0)**2+(h.vy||0)**2).toFixed(1);e.fillStyle=k,e.font="8px Space Mono",e.fillText(C,g+y+4,w)}}),o.showBoundingBox&&f.forEach(h=>{e.strokeStyle=m,e.lineWidth=1,e.strokeRect(h.minX,h.minY,h.width,h.height)}),o.drawScanlines&&J(e,a,t),o.drawGlitch&&Z(e,a,t),o.drawInterference&&K(e,a,t)}function ae(e,p,f,b,c){const n={r:parseInt(c.slice(1,3),16),g:parseInt(c.slice(3,5),16),b:parseInt(c.slice(5,7),16)};for(let r=1;r<=5;r++){const o=r/5;e.beginPath(),e.arc(p,f,b*o,0,Math.PI*2),e.strokeStyle=`rgba(${n.r},${n.g},${n.b},${.3*o})`,e.lineWidth=1,e.stroke()}}class te{constructor(p){B(this,"canvas");B(this,"ctx");B(this,"video",null);B(this,"stream",null);B(this,"animationId",null);B(this,"lastFrameTime",0);B(this,"fps",0);B(this,"frameCount",0);B(this,"blobs",[]);B(this,"prevBlobs",[]);B(this,"isTracking",!1);B(this,"videoMode",!1);B(this,"detectionCanvas");B(this,"detectionCtx");B(this,"lastVideoWidth",0);B(this,"lastVideoHeight",0);B(this,"feedbackCanvas");B(this,"feedbackCtx");this.canvas=document.getElementById(p),this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.detectionCanvas=document.createElement("canvas"),this.detectionCtx=this.detectionCanvas.getContext("2d",{willReadFrequently:!0}),this.feedbackCanvas=document.createElement("canvas"),this.feedbackCtx=this.feedbackCanvas.getContext("2d")}async startCamera(){try{this.stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}}}),this.video=document.createElement("video"),this.video.srcObject=this.stream,this.video.autoplay=!0,this.video.playsInline=!0,this.video.onloadedmetadata=()=>{this.isTracking=!0,this.processFrame()}}catch(p){throw console.error("Camera access denied:",p),p}}stopCamera(){this.stream&&(this.stream.getTracks().forEach(p=>p.stop()),this.stream=null),this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.video=null,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.lastVideoWidth=0,this.lastVideoHeight=0,this.isTracking=!1,this.videoMode=!1}loadVideoFile(p){p.type.startsWith("video/")&&(this.stopCamera(),this.video=document.createElement("video"),this.video.src=URL.createObjectURL(p),this.video.autoplay=!0,this.video.loop=!0,this.video.playsInline=!0,this.video.onloadedmetadata=()=>{this.videoMode=!0,this.isTracking=!0,this.prevBlobs=[],this.frameCount=0,this.processFrame()})}processFrame(){if(!this.video||this.video.readyState!==this.video.HAVE_ENOUGH_DATA){this.animationId=requestAnimationFrame(()=>this.processFrame());return}const p=performance.now();p-this.lastFrameTime>0&&(this.fps=1e3/(p-this.lastFrameTime)),this.lastFrameTime=p;const f=this.video.videoWidth,b=this.video.videoHeight;(f!==this.lastVideoWidth||b!==this.lastVideoHeight)&&(this.canvas.width=f,this.canvas.height=b,this.lastVideoWidth=f,this.lastVideoHeight=b);const c=R();if(this.ctx.drawImage(this.video,0,0),c.drawInvert){const s=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height),i=s.data;for(let m=0;m<i.length;m+=4)i[m]=255-i[m],i[m+1]=255-i[m+1],i[m+2]=255-i[m+2];this.ctx.putImageData(s,0,0)}const n=c.resolutionScale,r=Math.floor(f*n),o=Math.floor(b*n);(this.detectionCanvas.width!==r||this.detectionCanvas.height!==o)&&(this.detectionCanvas.width=r,this.detectionCanvas.height=o),this.detectionCtx.drawImage(this.video,0,0,r,o);const a=this.detectionCtx.getImageData(0,0,r,o);this.frameCount++,(!c.enableSkip||this.frameCount%2===0)&&(this.blobs=z(a),this.blobs.forEach(s=>{s.x*=1/n,s.y*=1/n,s.minX*=1/n,s.maxX*=1/n,s.minY*=1/n,s.maxY*=1/n,s.width*=1/n,s.height*=1/n}),this.blobs=X(this.blobs,this.prevBlobs),this.prevBlobs=this.blobs),ee(this.ctx,this.canvas,this.blobs,this.frameCount,this.fps,this.feedbackCanvas,this.feedbackCtx),document.getElementById("fps").textContent=Math.round(this.fps).toString(),document.getElementById("blobCount").textContent=this.blobs.length.toString(),this.videoMode&&this.video.requestVideoFrameCallback?this.video.requestVideoFrameCallback(()=>this.processFrame()):this.animationId=requestAnimationFrame(()=>this.processFrame())}getFps(){return this.fps}getBlobs(){return this.blobs}isActive(){return this.isTracking}}function oe(){const e=document.getElementById("app");e.innerHTML=`
    <div id="canvas-container">
      <canvas id="videoCanvas"></canvas>
      <div id="dropZone">drop video here</div>
      <div id="status">
        <div>
          <span id="statusText">ready</span> / fps: <span id="fps">0</span> /
          blobs: <span id="blobCount">0</span>
        </div>
      </div>
    </div>

    <div id="controls">
      <button id="toggleBtn">toggle camera</button>
      <button id="loadVideoBtn">load video</button>
      <button id="recordBtn">record camera</button>
      <button id="exportBtn" style="display:none">export video</button>
      <input type="file" id="videoInput" accept="video/*" style="display:none" />

      <div class="control-group">
        <h3>detection</h3>
        <label>threshold <span class="value-display" id="thresholdVal">127</span></label>
        <input type="range" id="threshold" min="0" max="255" value="127" />
        <label>min area <span class="value-display" id="minAreaVal">10</span></label>
        <input type="range" id="minArea" min="1" max="100" value="10" />
        <label>max area <span class="value-display" id="maxAreaVal">500</span></label>
        <input type="range" id="maxArea" min="100" max="2000" value="500" />
        <label>max blobs <span class="value-display" id="maxBlobsVal">50</span></label>
        <input type="range" id="maxBlobs" min="1" max="100" value="50" />
      </div>

      <div class="control-group">
        <h3>performance</h3>
        <label>resolution <span class="value-display" id="resScaleVal">1.00</span></label>
        <input type="range" id="resScale" min="0.25" max="1" step="0.05" value="1.0" />
        <div class="checkbox-label">
          <input type="checkbox" id="enableSkip" checked /><span>frame skip</span>
        </div>
      </div>

      <div class="control-group">
        <h3>style</h3>
        <label>outline</label>
        <input type="color" id="outlineColor" value="#ffffff" class="color-picker" />
        <label>trail</label>
        <input type="color" id="trailColor" value="#ffffff" class="color-picker" />
        <label>thickness <span class="value-display" id="thicknessVal">2</span></label>
        <input type="range" id="thickness" min="1" max="5" value="2" />
        
        <div class="checkbox-label">
          <input type="checkbox" id="shapeBracket" checked /><span>bracket</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeRect" /><span>rectangle</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeConcentric" /><span>concentric</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeCrosshair" /><span>crosshair</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeInner" /><span>inner</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeRing" /><span>ring</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeDiamond" /><span>diamond</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapePulse" /><span>pulse</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="shapeRetroFrame" /><span>retro frame</span>
        </div>
        
        <label>glow <span class="value-display" id="glowIntensityVal">0</span></label>
        <input type="range" id="glowIntensity" min="0" max="20" value="0" />
      </div>

      <div class="control-group">
        <h3>connection</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawTrails" checked /><span>trails</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailStyleSmooth" checked /><span>smooth</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailStyleNeon" /><span>neon</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailStyleRainbow" /><span>rainbow</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailStyleDots" /><span>dots</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailConnectionSpline" checked /><span>spline</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailConnectionDirect" /><span>direct</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="trailConnectionParticles" /><span>particles</span>
        </div>
        <label>glow <span class="value-display" id="trailGlowVal">0</span></label>
        <input type="range" id="trailGlow" min="0" max="20" value="0" />
        <label>length <span class="value-display" id="trailLengthVal">10</span></label>
        <input type="range" id="trailLength" min="2" max="50" value="10" />
        <div class="checkbox-label">
          <input type="checkbox" id="trailFade" checked /><span>fade</span>
        </div>
      </div>

      <div class="control-group">
        <h3>features</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="showGrid" /><span>grid</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showCornerMarks" /><span>corner marks</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showTimestamp" /><span>timestamp</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showCounter" /><span>counter</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showTraceLine" /><span>trace line</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showVelocityText" /><span>velocity text</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="showBoundingBox" /><span>bounding box</span>
        </div>
      </div>

      <div class="control-group">
        <h3>mirror</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawMirror" /><span>mirror</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawKaleidoscope" /><span>kaleidoscope</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawTileMirror" /><span>tile mirror</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawFractal" /><span>fractal</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawTunnel" /><span>tunnel</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawRippleMirror" /><span>ripple</span>
        </div>
        <label>segments <span class="value-display" id="mirrorSegmentsVal">6</span></label>
        <input type="range" id="mirrorSegments" min="2" max="12" value="6" />
      </div>

      <div class="control-group">
        <h3>glitch</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawRGBSplit" /><span>rgb split</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawChromatic" /><span>chromatic</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawBlockGlitch" /><span>block glitch</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawVHS" /><span>vhs</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawTear" /><span>tear</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawShift" /><span>shift</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawWave" /><span>wave</span>
        </div>
        <label>offset <span class="value-display" id="glitchOffsetVal">5</span></label>
        <input type="range" id="glitchOffset" min="1" max="20" value="5" />
      </div>

      <div class="control-group">
        <h3>effects</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawInvert" /><span>invert</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawSolarize" /><span>solarize</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawScanlines" /><span>scanlines</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawCRT" /><span>crt</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawGlitch" /><span>glitch</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawInterference" /><span>interference</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawEdge" /><span>edge</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawThermal" /><span>thermal</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawFeedback" /><span>feedback</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawDuotone" /><span>duotone</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawBloom" /><span>bloom</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawFilmGrain" /><span>film grain</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawColorShift" /><span>color shift</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawLensFlare" /><span>lens flare</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawTwist" /><span>twist</span>
        </div>
        <label>twist <span class="value-display" id="twistAngleVal">30</span></label>
        <input type="range" id="twistAngle" min="10" max="90" value="30" />
        <div class="checkbox-label">
          <input type="checkbox" id="drawFilmBurn" /><span>film burn</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawDropShadow" /><span>drop shadow</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawSparkle" /><span>sparkle</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawReflection" /><span>reflection</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawFloorReflection" /><span>floor</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawGlass" /><span>glass</span>
        </div>
      </div>

      <div class="control-group">
        <h3>color post</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawPosterize" /><span>posterize</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawPixelate" /><span>pixelate</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawQuantize" /><span>quantize</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawThreshold" /><span>threshold</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawBlur" /><span>blur</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawZoomBlur" /><span>zoom blur</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawSharpen" /><span>sharpen</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawVignette" /><span>vignette</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawNoise" /><span>noise</span>
        </div>
        <label>levels <span class="value-display" id="colorLevelsVal">6</span></label>
        <input type="range" id="colorLevels" min="2" max="16" value="6" />
      </div>

      <div class="control-group">
        <h3>smoothing</h3>
        <label>motion <span class="value-display" id="motionSmoothVal">0.5</span></label>
        <input type="range" id="motionSmooth" min="0" max="1" step="0.1" value="0.5" />
        <label>line smoothness <span class="value-display" id="lineSmoothVal">8</span></label>
        <input type="range" id="lineSmooth" min="2" max="16" value="8" />
      </div>

      <div class="control-group">
        <h3>90s retro</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawDateStamp" /><span>date stamp</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawLetterbox" /><span>letterbox</span>
        </div>
        <label>bar height <span class="value-display" id="letterboxHeightVal">50</span></label>
        <input type="range" id="letterboxHeight" min="20" max="100" value="50" />
        <div class="checkbox-label">
          <input type="checkbox" id="drawTrackingLines" /><span>tracking lines</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawColorBleed" /><span>color bleed</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawStatic" /><span>static</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawJitter" /><span>jitter</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawColorBars" /><span>color bars</span>
        </div>
        <label>intensity <span class="value-display" id="staticIntensityVal">10</span></label>
        <input type="range" id="staticIntensity" min="1" max="20" value="10" />
      </div>

      <div class="control-group">
        <h3>color grade</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawCold" /><span>cold</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawWarm" /><span>warm</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawNoir" /><span>noir</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawSepia" /><span>sepia</span>
        </div>
      </div>

      <div class="control-group">
        <h3>neon cyber</h3>
        <div class="checkbox-label">
          <input type="checkbox" id="drawNeon" /><span>neon</span>
        </div>
        <label>color</label>
        <input type="color" id="neonColor" value="#00ffff" class="color-picker" />
        <div class="checkbox-label">
          <input type="checkbox" id="drawLaser" /><span>laser</span>
        </div>
        <label>laser color</label>
        <input type="color" id="laserColor" value="#ff0044" class="color-picker" />
        <label>laser mid color</label>
        <input type="color" id="laserMidColor" value="#00ff00" class="color-picker" />
        <label>laser corner color</label>
        <input type="color" id="laserCornerColor" value="#00ff00" class="color-picker" />
        <label>width <span class="value-display" id="laserWidthVal">2</span></label>
        <input type="range" id="laserWidth" min="1" max="5" value="2" />
        <label>threshold <span class="value-display" id="laserThresholdVal">200</span></label>
        <input type="range" id="laserThreshold" min="50" max="500" value="200" />
        <div class="checkbox-label">
          <input type="checkbox" id="drawHologram" /><span>hologram</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawMotionTrail" /><span>motion trail</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawStrobe" /><span>strobe</span>
        </div>
        <div class="checkbox-label">
          <input type="checkbox" id="drawMatrix" /><span>matrix</span>
        </div>
      </div>

      <div class="info">
        <a href="https://instagram.com/manojxshrestha" target="_blank" class="social-link">
          <img src="/Instagram.png" alt="Instagram" class="social-icon" />
          <span>@manojxshrestha</span>
        </a>
      </div>
    </div>
  `}function ne(e){let p=!1,f=!1,b=null,c=[];const n=document.getElementById("toggleBtn"),r=document.getElementById("loadVideoBtn"),o=document.getElementById("recordBtn"),a=document.getElementById("exportBtn"),t=document.getElementById("videoInput"),s=document.getElementById("statusText");n.addEventListener("click",async()=>{if(e.isActive())e.stopCamera(),p=!1,s.textContent="ready";else try{await e.startCamera(),p=!0,s.textContent="tracking"}catch{s.textContent="error"}}),r.addEventListener("click",()=>{t.click()}),t.addEventListener("change",g=>{var y;const w=(y=g.target.files)==null?void 0:y[0];w&&(e.stopCamera(),e.loadVideoFile(w),p=!0,s.textContent="video",a.style.display="block")});const i=document.getElementById("dropZone"),m=document.getElementById("canvas-container");m.addEventListener("dragover",g=>{g.preventDefault(),i.classList.add("active")}),m.addEventListener("dragleave",()=>{i.classList.remove("active")}),m.addEventListener("drop",g=>{var y;g.preventDefault(),i.classList.remove("active");const w=(y=g.dataTransfer)==null?void 0:y.files[0];w&&(e.stopCamera(),e.loadVideoFile(w),p=!0,s.textContent="video",a.style.display="block")}),o.addEventListener("click",async()=>{if(p)if(f)b&&(b.stop(),f=!1,o.textContent="record camera",s.textContent="tracking");else{const w=document.getElementById("videoCanvas").captureStream(30);let y="video/webm";MediaRecorder.isTypeSupported(y)||(y="video/webm;codecs=vp9"),MediaRecorder.isTypeSupported(y)||(y="video/webm;codecs=vp8"),b=new MediaRecorder(w,{mimeType:y}),c=[];let k=0;const C=setInterval(()=>{k+=2,k>=100?(k=100,clearInterval(C),b&&b.stop()):o.textContent=`recording ${k}%`},100);b.ondataavailable=M=>{M.data.size>0&&c.push(M.data)},b.onstop=()=>{clearInterval(C),o.textContent="recording 100%";const M=new Blob(c,{type:y}),D=URL.createObjectURL(M),T=document.createElement("a");T.href=D,T.download="webtouch-"+Date.now()+".webm",T.click(),URL.revokeObjectURL(D),setTimeout(()=>{o.textContent="record camera",s.textContent="tracking"},500)},b.start(100),f=!0,o.textContent="stop",s.textContent="recording"}else try{await e.startCamera(),p=!0,s.textContent="tracking"}catch{s.textContent="error"}}),a.addEventListener("click",async()=>{a.disabled=!0,s.textContent="exporting";const w=document.getElementById("videoCanvas").captureStream(30),y=new MediaRecorder(w,{mimeType:"video/webm"}),k=[];let C=0;const M=setInterval(()=>{C+=2,C>=100?(C=100,clearInterval(M),y.stop()):a.textContent=`exporting ${C}%`},100);y.ondataavailable=D=>{D.data.size>0&&k.push(D.data)},y.onstop=async()=>{a.textContent="converting to mp4...";const D=new Blob(k,{type:"video/webm"});try{const{convertWebmToMp4:T}=await U(async()=>{const{convertWebmToMp4:G}=await import("./ffmpeg-C21ms4T5.js");return{convertWebmToMp4:G}},[]);console.log("Converting webm to mp4...");const I=await T(D);console.log("MP4 conversion successful, size:",I.size);const S=URL.createObjectURL(I),L=document.createElement("a");L.href=S,L.download="webtouch-"+Date.now()+".mp4",L.click(),URL.revokeObjectURL(S)}catch(T){console.error("MP4 conversion failed:",T),a.textContent="fallback to webm...";const I=URL.createObjectURL(D),S=document.createElement("a");S.href=I,S.download="webtouch-"+Date.now()+".webm",S.click(),URL.revokeObjectURL(I)}setTimeout(()=>{a.textContent="export video",a.disabled=!1,s.textContent=p?"tracking":"ready"},500)},y.start(100),s.textContent="exporting 0%"});const h=["shapeBracket","shapeRect","shapeConcentric","shapeCrosshair","shapeInner","shapeRing","shapeDiamond","shapePulse","shapeRetroFrame"];h.forEach(g=>{const w=document.getElementById(g);w.addEventListener("change",()=>{w.checked&&h.forEach(M=>{const D=document.getElementById(M);M!==g&&(D.checked=!1)});const y=h.find(M=>document.getElementById(M).checked),C=y?{shapeBracket:"bracket",shapeRect:"rect",shapeConcentric:"concentric",shapeCrosshair:"crosshair",shapeInner:"inner",shapeRing:"ring",shapeDiamond:"diamond",shapePulse:"pulse",shapeRetroFrame:"retroframe"}[y]:"none";E({shapeStyle:C})})}),Object.entries({threshold:"threshold",minArea:"minArea",maxArea:"maxArea",maxBlobs:"maxBlobs",resScale:"resolutionScale",thickness:"thickness",motionSmooth:"motionSmoothing",lineSmooth:"lineSmoothing",trailGlow:"trailGlow",trailLength:"trailLength",mirrorSegments:"mirrorSegments",glitchOffset:"glitchOffset",colorLevels:"colorLevels",glowIntensity:"glowIntensity",letterboxHeight:"letterboxHeight",staticIntensity:"staticIntensity",laserWidth:"laserWidth",laserThreshold:"laserThreshold",twistAngle:"twistAngle"}).forEach(([g,w])=>{const y=document.getElementById(g),k=document.getElementById(g+"Val");y.addEventListener("input",C=>{const M=parseFloat(C.target.value);E({[w]:M}),k&&(k.textContent=g==="resScale"?M.toFixed(2):M.toString())})}),Object.entries({enableSkip:"enableSkip",drawTrails:"drawTrails",trailFade:"trailFade",showGrid:"showGrid",showCornerMarks:"showCornerMarks",showTimestamp:"showTimestamp",showCounter:"showCounter",showTraceLine:"showTraceLine",showVelocityText:"showVelocityText",showBoundingBox:"showBoundingBox",drawMirror:"drawMirror",drawKaleidoscope:"drawKaleidoscope",drawTileMirror:"drawTileMirror",drawFractal:"drawFractal",drawTunnel:"drawTunnel",drawRippleMirror:"drawRippleMirror",drawRGBSplit:"drawRGBSplit",drawChromatic:"drawChromatic",drawBlockGlitch:"drawBlockGlitch",drawVHS:"drawVHS",drawTear:"drawTear",drawShift:"drawShift",drawWave:"drawWave",drawInvert:"drawInvert",drawSolarize:"drawSolarize",drawScanlines:"drawScanlines",drawCRT:"drawCRT",drawGlitch:"drawGlitch",drawInterference:"drawInterference",drawEdge:"drawEdge",drawThermal:"drawThermal",drawFeedback:"drawFeedback",drawDuotone:"drawDuotone",drawBloom:"drawBloom",drawFilmGrain:"drawFilmGrain",drawColorShift:"drawColorShift",drawPosterize:"drawPosterize",drawPixelate:"drawPixelate",drawQuantize:"drawQuantize",drawThreshold:"drawThreshold",drawBlur:"drawBlur",drawZoomBlur:"drawZoomBlur",drawSharpen:"drawSharpen",drawVignette:"drawVignette",drawNoise:"drawNoise",drawDateStamp:"drawDateStamp",drawLetterbox:"drawLetterbox",drawTrackingLines:"drawTrackingLines",drawColorBleed:"drawColorBleed",drawStatic:"drawStatic",drawJitter:"drawJitter",drawColorBars:"drawColorBars",drawCold:"drawCold",drawWarm:"drawWarm",drawNoir:"drawNoir",drawSepia:"drawSepia",drawNeon:"drawNeon",drawLaser:"drawLaser",drawHologram:"drawHologram",drawMotionTrail:"drawMotionTrail",drawStrobe:"drawStrobe",drawMatrix:"drawMatrix",drawLensFlare:"drawLensFlare",drawTwist:"drawTwist",drawFilmBurn:"drawFilmBurn",drawDropShadow:"drawDropShadow",drawSparkle:"drawSparkle",drawReflection:"drawReflection",drawFloorReflection:"drawFloorReflection",drawGlass:"drawGlass"}).forEach(([g,w])=>{document.getElementById(g).addEventListener("change",k=>{E({[w]:k.target.checked})})});const u=["trailStyleSmooth","trailStyleNeon","trailStyleRainbow","trailStyleDots"];u.forEach(g=>{const w=document.getElementById(g);w.addEventListener("change",()=>{w.checked&&u.forEach(C=>{const M=document.getElementById(C);C!==g&&(M.checked=!1)});const y=u.find(C=>document.getElementById(C).checked),k=y?y.replace("trailStyle","").toLowerCase():"smooth";E({trailStyle:k})})});const v=["trailConnectionSpline","trailConnectionDirect","trailConnectionParticles"];v.forEach(g=>{const w=document.getElementById(g);w.addEventListener("change",()=>{w.checked&&v.forEach(C=>{const M=document.getElementById(C);C!==g&&(M.checked=!1)});const y=v.find(C=>document.getElementById(C).checked),k=y?y.replace("trailConnection","").toLowerCase():"spline";E({trailConnection:k})})}),document.getElementById("outlineColor").addEventListener("input",g=>{E({outlineColor:g.target.value})}),document.getElementById("trailColor").addEventListener("input",g=>{E({trailColor:g.target.value})}),document.getElementById("neonColor").addEventListener("input",g=>{E({neonColor:g.target.value})}),document.getElementById("laserColor").addEventListener("input",g=>{E({laserColor:g.target.value})}),document.getElementById("laserMidColor").addEventListener("input",g=>{E({laserMidColor:g.target.value})}),document.getElementById("laserCornerColor").addEventListener("input",g=>{E({laserCornerColor:g.target.value})})}oe();const ie=new te("videoCanvas");ne(ie);
