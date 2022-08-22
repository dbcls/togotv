export default (context, inject) => {
  const converSecToHour = (time) => {
    const min = Math.floor(time / 60) % 60;
    const hour = Math.floor(time / 3600);

    if (hour === 0) {
      return `<span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">分</span>`;
    } else {
      return `<span class="time mont bold">${hour}</span><span style="font-size: 12px; margin-right: 2px;">時間</span><span class="time mont bold">${min}</span><span style="font-size: 12px; margin-right: 2px;">分</span>`;
    }
  };

  inject("converSecToHour", converSecToHour);
  context.$converSecToHour = converSecToHour;
};
