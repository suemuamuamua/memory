import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import '../assets/style/main.css'

//获取图片数据，将数据转换成url
let imgDatas = require('../data/data.json')
imgDatas.forEach((item, index) => {
  item.url = require('../assets/img/'+item.fileName);
})
/*
*获取随机值
*/
function getRandom(arr) {
  let [low,high] = arr;
  return Math.ceil(Math.random() * (high - low) + low)
}
/*
*获取随机角度
*/
function getDegRandom() {
  let baseDeg = 30;
  return Math.ceil((Math.random()>0.5?'':'-') + Math.random() * baseDeg)
}


class ImgFigure extends Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if(this.props.imgSetting.isCenter){
      // console.log(1)
      this.props.inverse()
    }else {
      this.props.center()
    }

    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let styleObj = {},
        figureClass = 'img-figure';
    figureClass += this.props.imgSetting.inverse?' is-inverse':'';
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.imgSetting.pos) {
      // styleObj = this.props.imgSetting.pos;
      //大坑，报错Cannot assign read only.....'zIndex' of object
      styleObj.left = this.props.imgSetting.pos.left;
      styleObj.top = this.props.imgSetting.pos.top;
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.imgSetting.rotate) {
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.imgSetting.rotate + 'deg)';
      })
    }
    if (this.props.imgSetting.isCenter) {
      styleObj.zIndex = 11;
    }
    return(
      <figure className={figureClass} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.url} />
        <figcaption>
          <h2 className="title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>{this.props.data.description}</p>
            <footer className="loc">--{this.props.data.locAndTime}</footer>
          </div>
        </figcaption>
      </figure>
    )
  }
}

class NavController extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(e) {
    if(!this.props.imgSetting.isCenter) {
      this.props.center()
    }else {
      this.props.inverse()
    }
    e.stopPropagation()
    e.preventDefault()
  }
  render() {
    var controllerClass = 'controller';
    controllerClass += this.props.imgSetting.isCenter?(this.props.imgSetting.inverse?' is-inverse is-center':' is-center'):'';
    return(<span className={controllerClass} onClick={this.handleClick}></span>)
  }
}


class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgArrangeArr: []
    }
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {//水平方向取值范围
        leftX: [0, 0],
        rightX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {//垂直方向取值范围
        topY: [0,0],
        x: [0, 0]
      }
    }
  }
  componentDidMount() {
    /*
    *组件加载完后计算图片位置
    */
    //获取舞台的宽高
    let stageDom = this.refs.stage,
        stageWidth = stageDom.scrollWidth,
        stageHeight = stageDom.scrollHeight,
        halfStageWidth = Math.ceil(stageWidth / 2),
        halfStageHeight = Math.ceil(stageHeight / 2);
    //获取图片的宽高
    let imgFigure = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgFigureWidth = imgFigure.scrollWidth,
        imgFigureHeight = imgFigure.scrollHeight,
        halfImgFigureWidth = Math.ceil(imgFigureWidth / 2),
        halfImgFigureHeight = Math.ceil(imgFigureHeight / 2);
    this.Constant.centerPos = {
      left: halfStageWidth - halfImgFigureWidth,
      top: halfStageHeight - halfImgFigureHeight
    }

    //水平方向图片位置计算
    this.Constant.hPosRange.leftX[0] = -halfImgFigureWidth;
    this.Constant.hPosRange.leftX[1] = halfStageWidth - halfImgFigureWidth * 3;
    this.Constant.hPosRange.rightX[1] = stageWidth - halfImgFigureWidth;
    this.Constant.hPosRange.rightX[0] = halfStageWidth + halfImgFigureWidth;
    this.Constant.hPosRange.y[0] = -halfImgFigureHeight;
    this.Constant.hPosRange.y[1] = stageHeight - halfImgFigureHeight;

    //垂直方向图片位置计算
    this.Constant.vPosRange.topY[0] = -halfImgFigureHeight;
    this.Constant.vPosRange.topY[1] = halfStageHeight - halfImgFigureHeight * 3;
    this.Constant.vPosRange.x[0] = -halfImgFigureWidth;
    this.Constant.vPosRange.x[1] = halfStageWidth + halfImgFigureWidth; 
    this.setPos(0)
  }
  /*
  *布局图片位置，传入center index
  */
  setPos(centerIndex) {
    let imgArrangeArr = this.state.imgArrangeArr,
        constant = this.Constant,
        imgTopArr = [],
        //上侧图片数量 0 or 1
        imgTopNum = Math.floor(Math.random() * 2),
        //上侧图片取出index
        imgTopSpliceIndex = 0,
        //中心图片状态信息
        imgCenterArr = imgArrangeArr.splice(centerIndex, 1);
    //居中中心图片
    imgCenterArr[0] = {
      pos: constant.centerPos,
      rotate: 0,
      isCenter: true,
      inverse: false
    }
    //设置上侧图片
    imgTopSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - imgTopNum));
    imgTopArr = imgArrangeArr.splice(imgTopSpliceIndex, imgTopNum);
    imgTopArr[0] = {
      pos: {
        left: getRandom(constant.vPosRange.x),
        top: getRandom(constant.vPosRange.topY)
      },
      rotate: getDegRandom(),
      isCenter: false,
      inverse: false
    };
    //设置左右侧图片
    let len = imgArrangeArr.length
    imgArrangeArr.forEach((item, index) => {
      let hPosRangeLORX = null
      if(index < len/2) {//前半数组放左侧，后半数组放右侧
        hPosRangeLORX = constant.hPosRange.leftX
      }else {
        hPosRangeLORX = constant.hPosRange.rightX
      }
      item.pos ={
        left: getRandom(hPosRangeLORX),
        top: getRandom(constant.hPosRange.y)
      }
      item.rotate = getDegRandom();
      item.isCenter = false;
      item.inverse = false;
      // console.log(item)
    })
    //将上侧图片和center放回数组
    if(imgTopNum) {
      imgArrangeArr.splice(imgTopSpliceIndex, 0, imgTopArr[0])
    }
    imgArrangeArr.splice(centerIndex, 0, imgCenterArr[0])
    //设置This.state
    this.setState({
      imgArrangeArr: imgArrangeArr
    })
  }
  inverse(index) {
    var imgArrangeArr = this.state.imgArrangeArr;
    
    imgArrangeArr[index].inverse = !imgArrangeArr[index].inverse;
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }
  center(index) {
    this.setPos(index)
  }
  render() {
    let imgFigures = [],
        navController = [];
    imgDatas.forEach((value, index) => {
      if(!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0,
          },
          rotate: 0,
          inverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} 
                                 key={index} 
                                 ref={'imgFigure'+index} 
                                 imgSetting={this.state.imgArrangeArr[index]} 
                                 inverse={this.inverse.bind(this, index)} 
                                 center={()=>this.center(index)}
                      ></ImgFigure>)
      navController.push(<NavController key={index}
                      imgSetting={this.state.imgArrangeArr[index]} 
                      inverse={this.inverse.bind(this, index)} 
                      center={()=>this.center(index)}
      ></NavController>)
    });
    
    return(
      <div className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {navController}
        </nav>
      </div>
    )
  }
}


export default Main;