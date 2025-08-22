// renderer.js
// 渲染进程：控制旋转、加速、点击/双击逻辑
(() => {
  const img = document.getElementById('icon');
  const circle = document.getElementById('circle');

  // 旋转控制参数（3 级变速）
  // baseDuration：基础旋转周期（秒）；level：速度等级（1~3）
  const baseDuration = 1; // “速度适中”的基准，越小越快
  let running = false;
  let level = 1;

  // 接收主进程传来的图标路径
  window.api.onIconPath((fileUrl) => {
    img.src = fileUrl;
  });

  // 应用速度（通过修改 CSS 动画时长）
  function applySpeed() {
    if (!running) {
      circle.style.animation = 'none';
      void circle.offsetWidth; // 强制回流以便下次重新触发动画
      return;
    }
    const duration = (baseDuration / level).toFixed(2) + 's';
    circle.style.animation = `spin ${duration} linear infinite`;
  }

  // 单击：开始/加速（1→2→3→1 循环）
  function onClick() {
    if (!running) {
      running = true;
      level = 1;
    } else {
      level += 1;
      if (level > 3) level = 1; // 超过 3 级回到最慢
    }
    applySpeed();
  }

  // 双击：关闭应用
  function onDblClick() {
    window.api.closeApp();
  }

  // 事件绑定（绑定在圆形图标容器，保证点击不受拖动区域影响）
  circle.addEventListener('click', onClick);
  circle.addEventListener('dblclick', onDblClick);
})();
