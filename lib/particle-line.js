(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.particleLine = factory());
}(this, (function () { 'use strict';

  var Vec2D = /** @class */ (function () {
      function Vec2D(x, y) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          this.x = x;
          this.y = y;
      }
      Vec2D.prototype.plus = function (p) {
          return new Vec2D(this.x + p.x, this.y + p.y);
      };
      Vec2D.prototype.minus = function (p) {
          return new Vec2D(this.x - p.x, this.y - p.y);
      };
      Vec2D.prototype.times = function (p) {
          return new Vec2D(this.x * p, this.y * p);
      };
      Vec2D.prototype.abs = function () {
          return Math.sqrt(this.x * this.x + this.y * this.y);
      };
      return Vec2D;
  }());

  var Field = /** @class */ (function () {
      function Field(center) {
          this.center = center;
      }
      Field.prototype.calcForce = function (p) {
          var _p = p.minus(this.center);
          if (_p.abs() >= 0 && _p.abs() < 200) {
              _p = _p.times(-1 / 8000);
          }
          else {
              _p.x = 0;
              _p.y = 0;
          }
          return _p;
      };
      Field.prototype.calcDrag = function (v) {
          var vabs = v.abs();
          var _v = new Vec2D(v.x, v.y);
          if (vabs > 0.5) {
              _v = _v.times(-0.001);
          }
          else {
              _v.x = 0;
              _v.y = 0;
          }
          return _v;
      };
      return Field;
  }());

  var Particle = /** @class */ (function () {
      function Particle(p) {
          this.r = 5;
          this.color = '#3463B3';
          this.pos = p.pos;
          this.v = p.v;
          if (p.r)
              this.r = p.r;
          if (p.color)
              this.color = p.color;
      }
      Particle.prototype.update = function (a) {
          if (a === void 0) { a = new Vec2D(0, 0); }
          this.v = this.v.plus(a);
          this.pos = this.pos.plus(this.v);
      };
      Particle.prototype.calcAcceleration = function (center) {
          var field = new Field(center);
          var f = field.calcForce(this.pos);
          var d = field.calcDrag(this.v);
          console.log(f);
          return f.plus(d);
      };
      Particle.prototype.draw = function (ctx) {
          ctx.beginPath();
          ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
      };
      Particle.prototype.connection = function (ctx, p, lineWidth) {
          ctx.beginPath();
          ctx.moveTo(this.pos.x, this.pos.y);
          ctx.lineTo(p.x, p.y);
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = this.color;
          ctx.stroke();
      };
      return Particle;
  }());
  var ParticleLine = /** @class */ (function () {
      function ParticleLine(background, color, node) {
          if (background === void 0) { background = '#2D3553'; }
          if (color === void 0) { color = '#3463B3'; }
          if (node === void 0) { node = null; }
          this.width = 300;
          this.height = 300;
          this.surplus = 0;
          this.particleNum = 100;
          this.particleArr = [];
          this.particleMouse = null;
          var body = document.querySelector('body');
          this.background = background;
          this.color = color;
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          var canvas = document.createElement('canvas');
          canvas.innerText = '您的浏览器不支持 Canvas!';
          canvas.width = this.width;
          canvas.height = this.height;
          if (node === null)
              node = body.childNodes[0];
          body.insertBefore(canvas, node);
          this.ctx = canvas.getContext('2d');
          this.particleNum = this.getParticleNum(this.width, this.height);
          // this.particleNum = 1
          this.mousemove(canvas);
          this.mouseover(canvas);
          this.mouseout(canvas);
          this.animation();
      }
      ParticleLine.prototype.createParticle = function () {
          var len = this.particleArr.length;
          if (len >= this.particleNum)
              return;
          for (var i = len; i < this.particleNum; i++) {
              var _r = 5;
              var _p = new Particle({ pos: new Vec2D(this.randomRange(_r, this.width - _r), this.randomRange(_r, this.height - _r)), v: new Vec2D(this.randomRange(-1, 1, true, false), this.randomRange(-1, 1, true, false)), r: _r, color: "rgb(" + this.randomRange(0, 255, false) + "," + this.randomRange(0, 255, false) + "," + this.randomRange(0, 255, false) + ")" });
              this.particleArr.push(_p);
              this.surplus++;
          }
      };
      ParticleLine.prototype.draw = function () {
          var _a;
          var ctx = this.ctx;
          this.createParticle();
          ctx.clearRect(0, 0, this.width, this.height);
          ctx.fillStyle = this.background;
          ctx.fillRect(0, 0, this.width, this.height);
          for (var i = 0; i < this.surplus; i++) {
              var currP = this.particleArr[i];
              currP.draw(ctx);
              currP.update();
              if (currP.pos.x <= -5 || currP.pos.x >= this.width + 5 || currP.pos.y <= -5 || currP.pos.y >= this.height + 5) {
                  _a = [this.particleArr[this.surplus - 1], this.particleArr[i]], this.particleArr[i] = _a[0], this.particleArr[this.surplus - 1] = _a[1];
                  this.surplus--;
                  continue;
              }
              for (var i2 = i + 1; i2 < this.surplus; i2++) {
                  var p2 = this.particleArr[i2].pos;
                  var l = currP.pos.minus(p2).abs();
                  if (l < 80) {
                      currP.connection(ctx, p2, 2 * ((80 - l) / 80));
                  }
              }
          }
          if (this.particleMouse !== null) {
              this.particleMouse.draw(ctx);
              var pMouse = this.particleMouse;
              for (var i = 0; i < this.particleNum; i++) {
                  var p = this.particleArr[i];
                  var l = pMouse.pos.minus(p.pos).abs();
                  if (l < 80) {
                      this.particleMouse.connection(ctx, p.pos, 2 * ((80 - l) / 80));
                  }
                  if (l < 200) {
                      var a = p.calcAcceleration(pMouse.pos);
                      p.update(a);
                  }
              }
          }
          this.particleArr.splice(this.surplus);
      };
      ParticleLine.prototype.animation = function () {
          var _this = this;
          this.draw();
          requestAnimationFrame(function () { return _this.animation(); });
      };
      ParticleLine.prototype.randomRange = function (min, max, allowDecimal, allowZero) {
          if (allowDecimal === void 0) { allowDecimal = true; }
          if (allowZero === void 0) { allowZero = true; }
          if (max <= min)
              throw '范围出错。';
          var num = min + Math.random() * (max - min);
          if (allowDecimal) {
              num = Math.floor(num * 100) / 100;
          }
          else {
              num = Math.floor(num);
          }
          if (!allowZero && num === 0)
              num = this.randomRange(min, max, allowDecimal, allowZero);
          return num;
      };
      ParticleLine.prototype.getParticleNum = function (width, height) {
          var num = Math.floor(width / 50) * Math.floor(height / 100);
          return num;
      };
      ParticleLine.prototype.mouseover = function (el) {
          var _this = this;
          return el.addEventListener('mouseover', function (e) {
              _this.particleMouse = new Particle({ pos: new Vec2D(e.clientX, e.clientY), v: new Vec2D(0, 0) });
          });
      };
      ParticleLine.prototype.mousemove = function (el) {
          var _this = this;
          return el.addEventListener('mousemove', function (e) {
              if (_this.particleMouse !== null) {
                  _this.particleMouse.pos.x = e.clientX;
                  _this.particleMouse.pos.y = e.clientY;
              }
          });
      };
      ParticleLine.prototype.mouseout = function (el) {
          var _this = this;
          return el.addEventListener('mouseout', function () {
              _this.particleMouse = null;
          });
      };
      return ParticleLine;
  }());

  return ParticleLine;

})));
