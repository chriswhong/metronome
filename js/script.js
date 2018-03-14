//add leading zero and convert to string
const make2digits = (number) => (number > 9) ? `${number}` : `0${number}`;

//figure out corresponding down values... special treatment for zeroes
const getDown = (upValue, max) => {
  if (upValue == '00') return (max - 1).toString();

  return make2digits(((max - upValue) % max) - 1);
}

$( document ).ready(function() {
  //constiable font sizing from http://stackoverflow.com/questions/5358183/is-it-possible-to-dynamically-scale-text-size-based-on-browser-width
  const $body = $('body'); //Cache this for performance
  const setBodyScale = () => {
    const scaleSource = $body.width(),
        scaleFactor = 0.14,
        maxScale = 500,
        minScale = 10; //Tweak these values to taste

    let fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

    if (fontSize > maxScale) fontSize = maxScale;
    if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

    $('body').css('font-size', fontSize + '%');
    $('#time').css('letter-spacing', (fontSize/10) + 'px');
  }

  $(window).resize(() => {
    setBodyScale();
  });

  //run once
  setBodyScale();

  //repeat every 10th of a second, forever
  setInterval(() => {
    const time = new Date;

    const hoursUp = make2digits(time.getHours());
    const minutesUp = make2digits(time.getMinutes());
    const secondsUp = make2digits(time.getSeconds());
    const decisecondsUp = Math.floor((time.getTime() % 1000) / 100);

    const decisecondsDown = (10 - decisecondsUp) % 10; //doesn't need getDown because it's only ever one digit, I think
    const secondsDown = getDown(secondsUp, 60);
    const minutesDown = getDown(minutesUp, 60);
    const hoursDown = getDown(hoursUp, 24);

    const upString = `${hoursUp}${minutesUp}${secondsUp}${decisecondsUp}`;
    const downString = `${decisecondsDown}${secondsDown}${minutesDown}${hoursDown}`;

    //every 100th of a second, update the center digit, break at 9
    let centerDigit = 0;
    const centerInterval = setInterval(() => {
      centerDigit += 1;
      $('#time').text(`${upString}${centerDigit}${downString}`);
      if(centerDigit === 9) {
        clearInterval(centerInterval);
      }
    }, 10);
  }, 100);
});
