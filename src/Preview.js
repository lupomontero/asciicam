import React from 'react';
import ascii from './ascii';


window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia
  || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia
  || navigator.msGetUserMedia;


class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      frame: null,
    };

    this.video = document.createElement('video');
    this.video.setAttribute('width', props.cols);
    this.video.setAttribute('height', props.rows);

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', props.cols);
    this.canvas.setAttribute('height', props.rows);

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    if (typeof navigator.getUserMedia !== 'function') {
      return alert('Browser not supported :-(');
    }

    navigator.getUserMedia({ video: true }, (stream) => {
      if (this.video.mozSrcObject !== undefined) { // hack for Firefox < 19
        this.video.mozSrcObject = stream;
      } else {
        this.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      }
      this.start();
    }, (err) => {
      console.error(err);
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  start() {
    const { video, canvas } = this;
    const ctx = canvas.getContext('2d');
    const fps = 5;

    video.play();

    this.renderTimer = setInterval(() => {
      ctx.drawImage(video, 0, 0, video.width, video.height);
      ascii.fromCanvas(canvas, {
        contrast: 1,
        callback: (asciiString) => {
          this.setState({ frame: asciiString });
        }
      });
    }, Math.round(1000 / fps));
  }

  pause() {
    if (this.renderTimer) {
      clearInterval(this.renderTimer)
    };
    this.video.pause();
  }

  stop() {
    this.pause();

    if (this.video.mozSrcObject !== undefined) {
      this.video.mozSrcObject = null;
    } else {
      this.video.src = '';
    }
  }

  render() {
    return (
      <pre
        style={{
          fontSize: `${this.state.width / this.props.cols}px`,
          lineHeight: `${this.state.width / this.props.cols}px`,
          letterSpacing: 0,
        }}
        dangerouslySetInnerHTML={{ __html: this.state.frame }}
      />
    );
  }
}

export default Preview;
