console.log(`原作者Karlin，https://github.com/Karlin-Z/`);
console.log(`Kanyeishere修改版，保留p5一运蓝线引导分摊和小电视指路，并修改了指路规则以配合mlm轮椅`);


let pipeAoe=false;
let aoeport = 9588; //aoe监听的端口

function postAoe(data) {
  if (pipeAoe) {
    sendExtraLogCommand(`Add`,data);
  }else{
    fetch(`http://127.0.0.1:${aoeport}/Add`, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: data
    });
  }
}
function removeAoe(data) {
  if (pipeAoe){
    sendExtraLogCommand(`Remove`,data);
  }else{
    fetch(`http://127.0.0.1:${aoeport}/Remove`, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: data
    });
  }
}
function requestPartyList() {
  if (pipeAoe){
    sendExtraLogCommand(`GetData`,"Team");
  }else{
    fetch(`http://127.0.0.1:${aoeport}/GetData`, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: "Team"
    });
  }
}

const delayFunction = ms => new Promise(res => setTimeout(res, ms));

const sendCommand = (command) => {
  callOverlayHandler({ call: 'PostNamazu', c: 'command', p: `${command}` });
}
const sendMark = (text) => {
  callOverlayHandler({ call: 'PostNamazu', c: 'mark', p: JSON.stringify(text) });
}
const sendText = (text) => {
  callOverlayHandler({
    call: "PostNamazu",
    c: "command",
    p: `/e ${text}`,
  });
}

function faceClassification(face, eps=0.01) {
  if ((-eps < (face-3.14)) &&  ((face-3.14) < eps)) {
    return 3.14;
  }
  if ((-eps < (face+3.14)) &&  ((face+3.14) < eps)) {
    return -3.14;
  }
  if ((-eps < (face-1.57)) &&  ((face-1.57) < eps)) {
    return 1.57;
  }
  if ((-eps < (face+1.57)) &&  ((face+1.57) < eps)) {
    return -1.57;
  }
  if ((-eps < (face-4.71)) &&  ((face-4.71) < eps)) {
    return 4.71;
  }
  if ((-eps < (face+4.71)) &&  ((face+4.71) < eps)) {
    return -4.71;
  }
  if ((-eps < (face-6.28)) &&  ((face-6.28) < eps)) {
    return 6.28;
  }
  if ((-eps < (face+6.28)) &&  ((face+6.28) < eps)) {
    return -6.28;
  }
  return face;
}

async function  setFace (face, delay, during) {
  console.log(`{"Face":${face},"Delay":${delay},"During":${during}}`);
  await delayFunction(delay*1000);
  sendText(`发送鲶鱼精-原始面向${face}`);
  sendText(`发送鲶鱼精-面向${faceClassification(face)}`);
  return;
  if (pipeAoe) {
    sendExtraLogCommand(`SetFace`, `{"Face":${face},"Delay":${delay},"During":${during}}`);
  } else {
    fetch(`http://127.0.0.1:${aoeport}/SetFace`, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: `{"Face":${face},"Delay":${delay},"During":${during}}`
    });
  }
}


function PostNamazuMarkClear() {
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <1>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <2>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <3>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <4>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <5>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <6>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <7>'
  });
  callOverlayHandler({
    call: "PostNamazu",
    c: 'command',
    p: '/mk clear <8>'
  });
}
const sendExtraLogCommand = (command,info) => {
  callOverlayHandler({ call: 'ExtraLog', c: `${command}`, p: `${info}` });
}
const firstMarker = parseInt('0017', 16);
const getHeadmarkerId = (data, matches) => {
  if (data.decOffset === undefined)
    data.decOffset = parseInt(matches.id, 16) - firstMarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
}
const RotatePointFromCentre = (point, centre, angle) => {
  let rot=(1-(Math.atan2(point.posX-centre.posX,point.posY-centre.posY)/Math.PI))%2*180;
  let dis=Math.sqrt(Math.pow(point.posX - centre.posX, 2) + Math.pow((point.posY - centre.posY), 2));
  var end=new Object();
  end.posX = centre.posX+Math.sin((rot + angle) / 180 * Math.PI) * dis;
  end.posY = centre.posY-Math.cos((rot + angle) / 180 * Math.PI) * dis; 
  return end;
}

const distanceCalculation = (pointA, pointB) => {
    const xDiff = pointB.posX - pointA.posX;
    const yDiff = pointB.posY - pointA.posY;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

let jobToRole = {
  PLD: 'tank',
  MNK: 'dps',
  WAR: 'tank',
  DRG: 'dps',
  BRD: 'dps',
  WHM: 'healer',
  BLM: 'dps',
  SMN: 'dps',
  SCH: 'healer',
  NIN: 'dps',
  MCH: 'dps',
  DRK: 'tank',
  AST: 'healer',
  SAM: 'dps',
  RDM: 'dps',
  GNB: 'tank',
  DNC: 'dps',
  RPR: 'dps',
  SGE: 'healer',
  BLU: 'dps',
};
Options.Triggers.push({
  id: 'TheOmegaProtocolUltimate_draw',
  zoneId: ZoneId.TheOmegaProtocolUltimate,
  config: [
    {
      id: "AoeSendMode",
      name: { en: "Aoe发送方式" },
      type: "select",
      options: { en: { "网络": "Http", "管道": "Pipe" } },
      default: "Http",
    },
    {
      id: "P3_Sort",
      name: { en: "P3地震优先级" },
      type: "select",
      options: { en: { "HTDH": "HTDH", "TDH": "TDH" } },
      default: "HTDH",
    },
    {
      id: "P3_Face",
      name: { en: "P3小电视自动面向" },
      type: "checkbox",
      default: false,
    },
    {
      id: "P5_2Tower",
      name: { en: "P5二运踩塔方式" },
      type: "select",
      options: { en: { "莫灵喵原版": "MLM", "斜米无脑式": "Fool" } },
      default: "MLM",
    },
    {
      id: "P5_1Marker",
      name: { en: "P5一运标点" },
      type: "checkbox",
      default: false,
    },
    {
      id: "P5_2Marker",
      name: { en: "P5二运标点" },
      type: "checkbox",
      default: false,
    },
    {
      id: "P5_3Marker",
      name: { en: "P5三运标点" },
      type: "checkbox",
      default: false,
    },
    {
      id: "DebugMode",
      name: { en: "以下列职业角色触发触发器" },
      type: "checkbox",
      default: false,
    },
    {
      id: "TriggerJob",
      name: { en: "触发主视角职业" },
      type: "select",
      options: { en: {
        '骑士':`PLD`,
        '武僧':`MNK`,
        '战士':`WAR`,
        '龙骑':`DRG`,
        '诗人':`BRD`,
        '白魔':`WHM`,
        '黑魔':`BLM`,
        '召唤':`SMN`,
        '学者':`SCH`,
        '忍者':`NIN`,
        '机工':`MCH`,
        '黑骑':`DRK`,
        '占星':`AST`,
        '武士':`SAM`,
        '赤魔':`RDM`,
        '枪刃':`GNB`,
        '舞者':`DNC`,
        '镰刀':`RPR`,
        '贤者':`SGE`,
        '青魔':`BLU`
      } },
      default: "PLD",
    },
  ],
  initData: () => {
    return {
      phase: 'p1',
      阶段:'开场',
      点名列表: [],
      自己点名:0,
      tower:[],
      towerPos:[],
      myId:0,
      p1BossId:0,
      故障Buff:'',
    };
  },
  triggers: [
    { id: 'TOP 测试用触发器',
      type: 'Ability',
      netRegex: { id: '7BFD', capture: true },
      suppressSeconds: 20,
      run: async (data, matches) => {
        let jobid={
        "PLD":19,
        "MNK":20,
        "WAR":21,
        "DRG":22,
        "BRD":23,
        "WHM":24,
        "BLM":25,
        "SMN":27,
        "SCH":28,
        "NIN":30,
        "MCH":31,
        "DRK":32,
        "AST":33,
        "SAM":34,
        "RDM":35,
        "BLU":36,
        "GNB":37,
        "DNC":38,
        "RPR":39,
        "SGE":40,}
        if(data.triggerSetConfig.DebugMode)
        {
          data.role=jobToRole[data.triggerSetConfig.TriggerJob];
          data.job=data.triggerSetConfig.TriggerJob;
          let jid= jobid[data.triggerSetConfig.TriggerJob];
          let combatantData = (await callOverlayHandler({
            call: 'getCombatants',
          })).combatants;
          data.me=combatantData.find((v) => v.Job === jid)?.Name;
        }
      },
    },
    { id: 'TOP 获取小队列表',
      type: 'Ability',
      netRegex: { id: '7BFD', capture: true },
      suppressSeconds: 20,
      run: async (data, matches) => {
        if(data.triggerSetConfig.AoeSendMode === 'Http')
          pipeAoe=false;
        if(data.triggerSetConfig.AoeSendMode === 'Pipe')
          pipeAoe=true;
        requestPartyList();
      },
    },
    { id: 'TOP 处理小队列表',
      regex: /Debug FB:PartyList:(?<Str>[^:]*):End/,
      run: async (data, matches) => {
        let partylist = JSON.parse(matches.Str);
        data.HTDHParty=[];
        data.HTDHParty.push(partylist[2]);
        data.HTDHParty.push(partylist[0]);
        data.HTDHParty.push(partylist[1]);
        data.HTDHParty.push(partylist[4]);
        data.HTDHParty.push(partylist[5]);
        data.HTDHParty.push(partylist[6]);
        data.HTDHParty.push(partylist[7]);
        data.HTDHParty.push(partylist[3]);



        data.TDHParty=[];
        data.TDHParty.push(partylist[0]);
        data.TDHParty.push(partylist[1]);
        data.TDHParty.push(partylist[2]);
        data.TDHParty.push(partylist[3]);
        data.TDHParty.push(partylist[4]);
        data.TDHParty.push(partylist[5]);
        data.TDHParty.push(partylist[6]);
        data.TDHParty.push(partylist[7]);
        
      },
    },
    { id: 'TOP 分P',
      type: 'StartsUsing',
      // 7B40 = Firewall
      // 8014 = Run ****mi* (Sigma Version)
      // 8015 = Run ****mi* (Omega Version)
      netRegex: { id: ['7B40', '8014', '8015','7B03','7B0B','7B3E','7B38','7B88'], capture: true },
      run: (data, matches) => {
        switch (matches.id) {
          case '7B03':
            data.阶段 = '循环程序';
            break;
          case '7B0B':
            data.阶段 = '全能之主';
            break;
          case '7B3E':
            data.阶段 = 'P2协作程序PT';
            break;
          case '7B38':
            data.阶段 = 'P2协作程序LB';
            break;
          case '7B88':
            data.阶段 = 'delta';
            break;
          case '8014':
            data.阶段 = 'sigma';
            break;
          case '8015':
            data.阶段 = 'omega';
            break;
        }
        
      },
    },
    { id: 'TOP 分P_2',
      type: 'Ability',
      netRegex: { id: ['7BFD', '7B13', '7B47', '7B7C', '7F72'], capture: true },
      suppressSeconds: 20,
      run: (data, matches) => {
        switch (matches.id) {
          case '7B13':
            data.阶段 = 'P3开场';
            break;
          case '7B47':
            data.阶段 = 'p4';
            break;
          case '7B7C':
            data.阶段 = 'delta';
            break;
          case '7F72':
            data.阶段 = 'p6';
            break;
        }
      },
    },
    { id: 'TOP 清除排队buff',
      type: 'StartsUsing',
      // 7B03 = Program Loop
      // 7B0B = Pantokrator
      netRegex: { id: ['7B03', '7B0B','7B3E']},
      // Don't clean up when the buff is lost, as that happens after taking a tower.
      run: (data, matches) => {
         data.点名列表 = {};
         data.自己点名=0;
         data.p1BossId=parseInt(matches.sourceId, 16);
         },
    },
    { id: 'TOP 头顶点名解析',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.decOffset === undefined,
      // Unconditionally set the first headmarker here so that future triggers are conditional.
      run: (data, matches) => getHeadmarkerId(data, matches),
    },
    { id: 'TOP P1排队buff',
      type: 'GainsEffect',
      netRegex: { effectId: ['BBC', 'BBD', 'BBE', 'D7B'] },
      run: (data, matches) => {
        const effectToNum = {
          BBC: 1,
          BBD: 2,
          BBE: 3,
          D7B: 4,
        };
        const num = effectToNum[matches.effectId];
        if (num === undefined)
          return;
        if(data.点名列表[num]=== undefined) data.点名列表[num]=[];
        data.点名列表[num].push(parseInt(matches.targetId, 16));
        if (matches.target== data.me) {
          data.自己点名=num;
          data.myId=parseInt(matches.targetId, 16);
        }
        
      },
    },
    { id: 'TOP P3小电视buff采集',
    type: 'GainsEffect',
    // D7C = Oversampled Wave Cannon Loading (facing right)
    // D7D = Oversampled Wave Cannon Loading (facing left)
    netRegex: { effectId: ['D7C', 'D7D'] },
    run: (data, matches) => {
      if (data.小电视玩家===undefined) data.小电视玩家=[];
      data.小电视玩家.push(parseInt(matches.targetId, 16));
      if (matches.target==data.me) {
        data.myTvBuff=matches.effectId;
      }
    },
    
  },
  { id: 'TOP P3小电视站位',
    type: 'StartsUsing',
    netRegex: { id: ['7B6B','7B6C']},
    //7B6B 东
    //7B6C 西
    delaySeconds:0.5,
    run: (data, matches) => {
      let debugMode=false;
      let dur=10;

      let dx=1;
      if (matches.id=='7B6B')  dx=-1;
      let attack=[];
      let spread=[];
      for (let i = 0; i < 8; i++) {
        let id=data.HTDHParty[i];
        if(data.小电视玩家.indexOf(id)!=-1)
        {
          attack.push(id);
        }else{
          spread.push(id);
        }
      }

      if(attack[0]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3小电视1站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${attack[0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${100+4.6*dx},"Y":0,"Z":83},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视1站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${100+4.6*dx},"Y":0,"Z":83},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视1南北线","AoeType":"Link","CentreType":"PostionValue","CentreValue":{"X":${100+4.6*dx},"Y":0,"Z":80.0},"Centre2Type":"PostionValue","Centre2Value":{"X":${100+4.6*dx},"Y":0,"Z":90},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":${100+4.6*dx},"Y":0,"Z":83}`;
        }
      }
      if(attack[1]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3小电视2站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${attack[1]},"Centre2Type":"PostionValue","Centre2Value":{"X":86.99,"Y":0,"Z":95.4},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视2站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":86.99,"Y":0,"Z":95.4},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视2南北线","AoeType":"Link","CentreType":"PostionValue","CentreValue":{"X":82,"Y":0,"Z":95.4},"Centre2Type":"PostionValue","Centre2Value":{"X":92,"Y":0,"Z":95.4},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":86.99,"Y":0,"Z":95.4}`;
        }
      }
      if(attack[2]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3小电视3站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${attack[2]},"Centre2Type":"PostionValue","Centre2Value":{"X":86.99,"Y":0,"Z":104.6},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视3站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":86.99,"Y":0,"Z":104.6},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3小电视3南北线","AoeType":"Link","CentreType":"PostionValue","CentreValue":{"X":82,"Y":0,"Z":104.6},"Centre2Type":"PostionValue","Centre2Value":{"X":92,"Y":0,"Z":104.6},"Thikness":5,"Color":4278255360,"Delay":0,"During":5}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":86.99,"Y":0,"Z":104.6}`;
        }
      }
      if(spread[0]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3闲人1站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${spread[0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${100+0.5*dx},"Y":0,"Z":91.8},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3闲人1站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${100+0.5*dx},"Y":0,"Z":91.8},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":${100+0.5*dx},"Y":0,"Z":91.8}`;
        }
      }
      if(spread[1]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3闲人2站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${spread[1]},"Centre2Type":"PostionValue","Centre2Value":{"X":108.2,"Y":0,"Z":100},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3闲人2站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":108.2,"Y":0,"Z":100},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":108.2,"Y":0,"Z":100}`;
        }
      }
      if(spread[2]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3闲人3站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${spread[2]},"Centre2Type":"PostionValue","Centre2Value":{"X":119.5,"Y":0,"Z":100},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3闲人3站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":119.5,"Y":0,"Z":100},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":119.5,"Y":0,"Z":100}`;
        }
      }
      if(spread[3]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3闲人4站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${spread[3]},"Centre2Type":"PostionValue","Centre2Value":{"X":${100+0.5*dx},"Y":0,"Z":108.2},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3闲人4站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${100+0.5*dx},"Y":0,"Z":108.2},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":${100+0.5*dx},"Y":0,"Z":108.2}`;
        }
      }
      if(spread[4]==data.myId || debugMode)
      {
        //postAoe(`{"Name":"P3闲人5站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${spread[4]},"Centre2Type":"PostionValue","Centre2Value":{"X":${100+0.5*dx},"Y":0,"Z":119},"Thikness":5,"Color":4278255360,"Delay":0,"During":${dur}}`);
        //postAoe(`{"Name":"P3闲人5站位位置","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${100+0.5*dx},"Y":0,"Z":119},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
        if(!debugMode)
        {
          data.moveBuffer = `{"X":${100+0.5*dx},"Y":0,"Z":119}`;
        }
      }

    },
    
  },
  { id: 'TOP P3小电视设置面向',
    type: 'StartsUsing',
    netRegex: { id: ['7B6B','7B6C']},
    //7B6B 东
    //7B6C 西
    delaySeconds:0.5,
    run: (data, matches) => {
      // D7C = Oversampled Wave Cannon Loading (facing right)
      // D7D = Oversampled Wave Cannon Loading (facing left)
      //if(!data.triggerSetConfig.P3_Face) return;
      if(data.myTvBuff===undefined) return;
      let attackRight=false;
      if(data.myTvBuff=='D7C') attackRight=true;
      let attackEast=false;
      if(matches.id=='7B6B') attackEast=true;
      let attack=[];
      
      for (let i = 0; i < 8; i++) {
        let id=data.HTDHParty[i];
        if(data.小电视玩家.indexOf(id)!=-1)
        {
          attack.push(id);
        }
      }

      if(attack[0]==data.myId)
      {
        if ((attackEast && !attackRight) || (!attackEast && attackRight))
        {
          var face=Math.PI;
        }else{
          var face=0;
        }
      }
      if(attack[1]==data.myId)
      {
        if (attackRight) {
          var face=-Math.PI/2;
        }else{
          var face=Math.PI/2;
        }
      }
      if(attack[2]==data.myId)
      {
        if (attackRight) {
          var face=Math.PI/2;
        }else{
          var face=-Math.PI/2;
        }
      }
      if (face!==undefined) {
        
        setFace(face,8.5,5);
      }
    },
  },
    { id: 'TOP P5 潜能量收集器',
      type: 'GainsEffect',
      netRegex: { effectId: 'D74'},
      run: (data, matches) => {
        if (data.P5潜能量计数器===undefined) data.P5潜能量计数器={};
        data.P5潜能量计数器[parseInt(matches.targetId, 16)]=parseInt(matches.count);
      },
    },
    { id: 'TOP P5 一运清除标记',
      type: 'StartsUsing',
      netRegex: { id: '7B88' },
      run: (data, matches) => {
        if (data.triggerSetConfig.P5_1Marker) {
          PostNamazuMarkClear();
        }
      },
    },
    { id: 'TOP P5 一运眼睛记录',
      type: 'Object',
      netRegex:
        /] ChatLog 00:0:103:.{8}:.{8}:00020001:0000000(?<x>[1-8]):/,
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        const dir = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          '5': 4,
          '6': 5,
          '7': 6,
          '8': 7,
        }[matches.x];
        data.P5眼睛=dir;
      },
    },
    { id: 'TOP P5 一运buff收集',
      type: 'GainsEffect',
      //D73远处
      //D72近处
      netRegex: { effectId: ['D73', 'D72'] },
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        if (matches.effectId=='D73') {
          data.P5一运远点名= parseInt(matches.targetId, 16);
        }else{
          data.P5一运近点名= parseInt(matches.targetId, 16);
        }
      },
    },
    { id: 'TOP P5 一运线收集',
      type: 'Tether',
      netRegex: { id: ['00C8','00C9']},
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        let tid= parseInt(matches.targetId, 16);
        let sid= parseInt(matches.sourceId, 16);
        if (matches.id=='00C9') {
          if (data.P5一运远线===undefined) data.P5一运远线=[];
          data.P5一运远线.push([sid,tid]);
          
        }
        if (matches.id=='00C8') {
          if (data.P5一运近线===undefined) data.P5一运近线=[];
          if (data.HTDHParty.indexOf(sid)<data.HTDHParty.indexOf(tid)) 
          {
            data.P5一运近线.push([sid,tid]);
          }else{
            data.P5一运近线.push([tid,sid]);
          }
        }
      },
    },
    { id: 'TOP P5 一运引导飞拳站位',
      type: 'GainsEffect',
      //D73远处
      //D72近处
      netRegex: { effectId: 'D73' },
      condition: (data) => data.阶段 === 'delta',
      delaySeconds:0.3,
      suppressSeconds:2,
      run: (data, matches) => {
        let dur=8;
        let delay=8-dur;
        let debugMode=false;

        data.moveBuffer=undefined;
        data.moveBuffer2=undefined;

        let r=(data.P5眼睛+2);
        var 中心={posX:100,posY:100};
        var 远点名=RotatePointFromCentre({posX:109.2,posY:90.8},中心,45*r);
        var 远点名搭档=RotatePointFromCentre({posX:90.8,posY:90.8},中心,45*r);
        var 近点名=RotatePointFromCentre({posX:103,posY:86.9},中心,45*r);
        var 近点名搭档=RotatePointFromCentre({posX:97,posY:86.9},中心,45*r);
        var 近线1=RotatePointFromCentre({posX:90.8,posY:107.7},中心,45*r);
        var 近线2=RotatePointFromCentre({posX:109.2,posY:107.7},中心,45*r);
        var 近线3=RotatePointFromCentre({posX:90.8,posY:110.7},中心,45*r);
        var 近线4=RotatePointFromCentre({posX:109.2,posY:110.7},中心,45*r);

        



        if(data.P5一运远线[0][0]==data.P5一运远点名) data.P5一运远点名搭档 = data.P5一运远线[0][1];
        if(data.P5一运远线[0][1]==data.P5一运远点名) data.P5一运远点名搭档 = data.P5一运远线[0][0];
        if(data.P5一运远线[1][0]==data.P5一运远点名) data.P5一运远点名搭档 = data.P5一运远线[1][1];
        if(data.P5一运远线[1][1]==data.P5一运远点名) data.P5一运远点名搭档 = data.P5一运远线[1][0];

        if(data.P5一运远线[0][0]==data.P5一运近点名) data.P5一运近点名搭档 = data.P5一运远线[0][1];
        if(data.P5一运远线[0][1]==data.P5一运近点名) data.P5一运近点名搭档 = data.P5一运远线[0][0];
        if(data.P5一运远线[1][0]==data.P5一运近点名) data.P5一运近点名搭档 = data.P5一运远线[1][1];
        if(data.P5一运远线[1][1]==data.P5一运近点名) data.P5一运近点名搭档 = data.P5一运远线[1][0];


        if(data.HTDHParty.indexOf(data.P5一运近线[0][0])>data.HTDHParty.indexOf(data.P5一运近线[1][0]))
        {
          var buffer=data.P5一运近线[0];
          data.P5一运近线[0]=data.P5一运近线[1];
          data.P5一运近线[1]=buffer;
        }

        if (data.P5一运远点名==data.myId || debugMode) {
          //postAoe(`{"Name":"P5一运远点名飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}}`;
          }
        }
        if (data.P5一运远点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}}`;
          }
        }
        if (data.P5一运近点名==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近点名飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}}`;
          }
        }
        if (data.P5一运近点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}}`;
          }
        }

        if (data.P5一运近线[0][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}}`;
          }
        }
        if (data.P5一运近线[0][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}}`;
          }
        }
        if (data.P5一运近线[1][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}}`;
          }
        }
        if (data.P5一运近线[1][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}}`;
          }
        }

        if(data.triggerSetConfig.P5_1Marker)
        {
          sendMark({ActorID: data.P5一运远点名,MarkType: 'bind1',LocalOnly: false,});
          sendMark({ActorID: data.P5一运近点名,MarkType: 'bind2',LocalOnly: false,});
          sendMark({ActorID: data.P5一运近线[0][0],MarkType: 'attack1',LocalOnly: false,});
          sendMark({ActorID: data.P5一运近线[0][1],MarkType: 'attack2',LocalOnly: false,});
          sendMark({ActorID: data.P5一运近线[1][0],MarkType: 'attack3',LocalOnly: false,});
          sendMark({ActorID: data.P5一运近线[1][1],MarkType: 'attack4',LocalOnly: false,});
        }
      },
    },
    { id: 'TOP P5 一运飞拳收集',
      type: 'AddedCombatant',
      netRegex: { npcNameId: ['7696','7697']},
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        if(data.P5一运飞拳===undefined) data.P5一运飞拳=[];
        if(data.P5一运飞拳_id===undefined) data.P5一运飞拳_id=[];
        if (data.P5一运飞拳_id.indexOf(matches.id)==-1) {
          data.P5一运飞拳_id.push(matches.id);
          let adjustPos= RotatePointFromCentre({posX:matches.x,posY:matches.y},{posX:100,posY:100},(6-data.P5眼睛)*45);
          let k= Math.floor(2 - (2 * Math.atan2(adjustPos.posX - 100, adjustPos.posY - 100)) / Math.PI) % 4;
          if (data.P5一运飞拳[k]==undefined){
            data.P5一运飞拳[k]=matches.npcNameId;
          }else{
            if(k==0)
            {
              data.P5一运远线交换=(data.P5一运飞拳[k]==matches.npcNameId);
            }
            if (k==1) {
              data.P5一运近线交换=(data.P5一运飞拳[k]==matches.npcNameId);
            }
          }
        }
      },
    },
    { id: 'TOP P5 一运飞拳线交换站位站位',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '7696'},
      condition: (data) => data.阶段 === 'delta',
      delaySeconds:0.5,
      suppressSeconds:2,
      run: (data, matches) => {
        let dur=9.3;
        let debugMode=false;


        let r=(data.P5眼睛+2);
        var 中心={posX:100,posY:100};
        var 远点名=RotatePointFromCentre({posX:109.2,posY:90.8},中心,45*r);
        var 远点名搭档=RotatePointFromCentre({posX:90.8,posY:90.8},中心,45*r);
        
        var 近点名=RotatePointFromCentre({posX:103,posY:90.8},中心,45*r);
        var 近点名搭档=RotatePointFromCentre({posX:97,posY:90.8},中心,45*r);
        var 近点名old=RotatePointFromCentre({posX:103,posY:90.8},中心,45*r);
        var 近点名搭档old=RotatePointFromCentre({posX:97,posY:90.8},中心,45*r);
        var 近线1=RotatePointFromCentre({posX:90.8,posY:109.2},中心,45*r);
        var 近线2=RotatePointFromCentre({posX:109.2,posY:109.2},中心,45*r);
        var 近线3=RotatePointFromCentre({posX:90.8,posY:109.2},中心,45*r);
        var 近线4=RotatePointFromCentre({posX:109.2,posY:109.2},中心,45*r);
        if (data.P5一运近线交换) {
          var b1=近线3;
          近线3=近线4;
          近线4=b1;
        }
        if (data.P5一运远线交换) {
          var b1=近点名;
          近点名=近点名搭档;
          近点名搭档=b1;
        }
        if (data.P5一运远点名==data.myId || debugMode) {
          //postAoe(`{"Name":"P5一运远点名飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名炸线后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名old.posX},"Y":0,"Z":${近点名old.posY}},"Radius":0.5,"Color":1073807104,"Delay":${dur},"During":2}`);
          //postAoe(`{"Name":"P5一运远点名炸线后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名old.posX},"Y":0,"Z":${近点名old.posY}},"Thikness":10,"Color":4278255360,"Delay":${dur},"During":2}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${远点名.posX},"Y":0,"Z":${远点名.posY}}`;
            data.moveBuffer2 = `{"X":${近点名old.posX},"Y":0,"Z":${近点名old.posY}}`;
          }
        }
        if (data.P5一运远点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档炸线后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名搭档old.posX},"Y":0,"Z":${近点名搭档old.posY}},"Radius":0.5,"Color":1073807104,"Delay":${dur},"During":2}`);
          //postAoe(`{"Name":"P5一运远点名搭档炸线后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名搭档old.posX},"Y":0,"Z":${近点名搭档old.posY}},"Thikness":10,"Color":4278255360,"Delay":${dur},"During":2}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${远点名搭档.posX},"Y":0,"Z":${远点名搭档.posY}}`;
            data.moveBuffer2 = `{"X":${近点名搭档old.posX},"Y":0,"Z":${近点名搭档old.posY}}`;
          }
        }
        if (data.P5一运近点名==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近点名飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近点名飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近点名.posX},"Y":0,"Z":${近点名.posY}}`;
          }
        }
        if (data.P5一运近点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近点名搭档.posX},"Y":0,"Z":${近点名搭档.posY}}`;
          }
        }

        if (data.P5一运近线[0][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}}`;
          }
        }
        if (data.P5一运近线[0][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}}`;
          }
        }
        if (data.P5一运近线[1][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}}`;
          }
        }
        if (data.P5一运近线[1][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳换位后站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}}`;
          }
        }
      },
    },
    { id: 'TOP P5 一运飞拳去引导提示',
      type: 'Ability',
      netRegex: { id: '7B21' },
      condition: (data) => data.阶段 === 'delta',
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          cn: '走走走',
        },
      },
    },
    { id: 'TOP P5 一运手臂引导点',
      type: 'HeadMarker',
      netRegex: {},
      condition: (data) => data.阶段 === 'delta',
      run: async (data, matches) => {
        let dur=5;
        let delay=10-dur;
        // dur =999;
        let debugMode=false;
        const id = getHeadmarkerId(data, matches);
        if (id !=`009C` && id !=`009D`) return;

        let rr = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        });
        let result=rr.combatants[0];
        if (result.BNpcID!=15719 && result.BNpcID!=15718) return;
        let adjustPos=RotatePointFromCentre({posX:result.PosX,posY:result.PosY},{posX:100,posY:100},(6-data.P5眼睛)*45);
        let k= Math.floor(2 - (2 * Math.atan2(adjustPos.posX - 100, adjustPos.posY - 100)) / Math.PI) % 4;

        let rot=77;
        if (id==`009D`) rot=rot*-1;

        let epos= RotatePointFromCentre({posX:(result.PosX-100)*0.8+100,posY:(result.PosY-100)*0.8+100},{posX:result.PosX,posY:result.PosY},rot);
        


        if (Math.abs(adjustPos.posX-100)<1 || Math.abs(adjustPos.posY-100)<1) {
          if (k==0||k==1) {
            if (data.P5一运近线[0][1]==data.myId|| debugMode) {
              //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
              if(!debugMode)
              {
                data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
              }
            } 
          }
          if (k==2||k==3) {
            if (data.P5一运近线[0][0]==data.myId|| debugMode) {
              //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
              if(!debugMode)
              {
                data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
              }
            }
          }
        }else{
          if (k == 0) {
            if (data.P5一运远线交换) {
              if (data.P5一运近点名搭档 == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            } else {
              if (data.P5一运近点名 == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            }
          }
          if (k == 3) {
            if (data.P5一运远线交换) {
              if (data.P5一运近点名 == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            } else {
              if (data.P5一运近点名搭档 == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            }
          }
          if (k == 1) {
            if (data.P5一运近线交换) {
              if (data.P5一运近线[1][0] == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            } else {
              if (data.P5一运近线[1][1] == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            }
          }
          if (k == 2) {
            if (data.P5一运近线交换) {
              if (data.P5一运近线[1][1] == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            } else {
              if (data.P5一运近线[1][0] == data.myId || debugMode) {
                //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos.posX},"Y":0,"Z":${epos.posY}},"Thikness":5,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
                if(!debugMode)
                {
                  data.moveBuffer = `{"X":${epos.posX},"Y":0,"Z":${epos.posY}}`;
                }
              }
            }
          }
        }

      },
    },
    { id: 'TOP P5 一运飞踢引导点',
      type: 'Object',
      netRegex:
        /] ChatLog 00:0:106:(?<sourceId>[^:]{8}):[^:]*:0197:0000:00001E4(?<mid>[34]):/,
      suppressSeconds:2,
      condition: (data) => data.阶段 === 'delta',
      run: async (data, matches) => {
        let dur=5;
        let delay=12-dur;
        let debugMode=false;

        let allCombatants = await callOverlayHandler({
          call: "getCombatants",
        });

        let myself = allCombatants.combatants[0];
        console.log(JSON.stringify(myself));
        let myPos = {
            posX: myself.PosX,
            posY: myself.PosY
        };

        let rr = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        let result=rr.combatants[0];
        if (result.BNpcID!=15719 && result.BNpcID!=15718) return;

        let r=(data.P5眼睛+2);

        let epos1= RotatePointFromCentre({posX:96,posY:100},{posX:100,posY:100},45*r);
        let epos2= RotatePointFromCentre({posX:104,posY:100},{posX:100,posY:100},45*r);

        let dist1 = distanceCalculation(myPos, epos1);
        let dist2 = distanceCalculation(myPos, epos2);


        if ((dist1 > dist2 && (data.P5一运远点名==data.myId || data.P5一运远点名搭档==data.myId)) || debugMode) {
          postAoe(`{"Name":"P5一运飞踢引导点站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${epos2.posX},"Y":0,"Z":${epos2.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          postAoe(`{"Name":"P5一运飞踢引导点站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.myId},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos2.posX},"Y":0,"Z":${epos2.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${epos2.posX},"Y":0,"Z":${epos2.posY}}`;
          }
        }
        if ((dist1 < dist2 && (data.P5一运远点名==data.myId || data.P5一运远点名搭档==data.myId)) || debugMode) {
          postAoe(`{"Name":"P5一运飞踢引导点站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${epos1.posX},"Y":0,"Z":${epos1.posY}},"Radius":0.5,"Color":1073807104,"Delay":${delay},"During":${dur}}`);
          postAoe(`{"Name":"P5一运飞踢引导点站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.myId},"Centre2Type":"PostionValue","Centre2Value":{"X":${epos1.posX},"Y":0,"Z":${epos1.posY}},"Thikness":10,"Color":4278255360,"Delay":${delay},"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${epos1.posX},"Y":0,"Z":${epos1.posY}}`;
          }
        }

      },
    },
    { id: 'TOP P5 一运盾连击S命中采集',
      type: 'Ability',
      netRegex: { id: '7B28'},
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        data.P5一运盾连击S目标=parseInt(matches.targetId, 16);
      },
    },
    { id: 'TOP P5 一运小电视buff采集',
      type: 'GainsEffect',
      // D7C = Oversampled Wave Cannon Loading (facing right)
      // D7D = Oversampled Wave Cannon Loading (facing left)
      netRegex: { effectId: ['D7C', 'D7D'] },
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        data.P5一运小电视={id:parseInt(matches.targetId, 16),effectId:matches.effectId};
        
      },
    },
    { id: 'TOP P5 一运小电视站位',
      type: 'StartsUsing',
      netRegex: { id: ['7B96','7B97']},
      //7B96 以A为北打西
      //7B97 以A为北打东
      delaySeconds:5.5,
      condition: (data) => data.阶段 === 'delta',
      run: (data, matches) => {
        let dur=4.5;
        let debugMode=false;
        if (debugMode) {
          dur=999
        }

        let r=(2+data.P5眼睛);
        var 中心={posX:100,posY:100};
        //近线组固定
        var 近线1=RotatePointFromCentre({posX:87,posY:100},中心,45*r);
        var 近线2=RotatePointFromCentre({posX:113,posY:100},中心,45*r);
        var 近线3=RotatePointFromCentre({posX:90.8,posY:109.2},中心,45*r);
        var 近线4=RotatePointFromCentre({posX:109.2,posY:109.2},中心,45*r);
        if (data.P5一运近线交换) {
          var b1=近线3;
          近线3=近线4;
          近线4=b1;
        }

        //远线组
        let dx=-1;
        if (matches.id=='7B96') dx=1;
        var 飞踢电视_电视=RotatePointFromCentre({posX:6*dx+100,posY:87},中心,45*r);
        var 飞踢电视_分摊=RotatePointFromCentre({posX:100+dx*2,posY:100},中心,45*r);

        var 飞踢闲人_飞踢=RotatePointFromCentre({posX:100+dx*1,posY:87},中心,45*r);
        var 飞踢闲人_分摊闲人=RotatePointFromCentre({posX:100+dx*2,posY:100},中心,45*r);
        var 飞踢闲人_分摊电视=RotatePointFromCentre({posX:5*dx+100,posY:100},中心,45*r);


        if (data.P5一运近线[0][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1小电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1小电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线1.posX},"Y":0,"Z":${近线1.posY}}`;
          }
        }
        if (data.P5一运近线[0][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1小电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1小电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线2.posX},"Y":0,"Z":${近线2.posY}}`;
          }
        }
        if (data.P5一运近线[1][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1小电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1小电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线3.posX},"Y":0,"Z":${近线3.posY}}`;
          }
        }
        if (data.P5一运近线[1][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1小电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1小电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${近线4.posX},"Y":0,"Z":${近线4.posY}}`;
          }
        }
        if(data.P5一运盾连击S目标==data.P5一运小电视.id)
        {
          //飞踢电视
          if (data.P5一运盾连击S目标==data.myId|| debugMode) {
            postAoe(`{"Name":"P5一运飞踢电视小电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢电视_电视.posX},"Y":0,"Z":${飞踢电视_电视.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运飞踢电视小电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运盾连击S目标},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢电视_电视.posX},"Y":0,"Z":${飞踢电视_电视.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢电视_电视.posX},"Y":0,"Z":${飞踢电视_电视.posY}}`;
            }
          }

          if (data.P5一运盾连击S目标!=data.P5一运远点名 && (data.P5一运远点名==data.myId || debugMode)) {
            postAoe(`{"Name":"P5一运远点名电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运远点名电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}}`;
            }
          }
          if (data.P5一运盾连击S目标!=data.P5一运远点名搭档 && (data.P5一运远点名搭档==data.myId|| debugMode)){
            postAoe(`{"Name":"P5一运远点名搭档电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运远点名搭档电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}}`;
            }
          }
          if (data.P5一运盾连击S目标!=data.P5一运近点名 && (data.P5一运近点名==data.myId|| debugMode)) {
            postAoe(`{"Name":"P5一运近点名电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运近点名电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}}`;
            }
          }
          if (data.P5一运盾连击S目标!=data.P5一运近点名搭档 && (data.P5一运近点名搭档==data.myId|| debugMode)) {
            postAoe(`{"Name":"P5一运远点名搭档电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运远点名搭档电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢电视_分摊.posX},"Y":0,"Z":${飞踢电视_分摊.posY}}`;
            }
          }
        }else{

          //飞踢闲人
          if (data.P5一运盾连击S目标==data.myId|| debugMode) {
            postAoe(`{"Name":"P5一运飞踢目标闲人站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_飞踢.posX},"Y":0,"Z":${飞踢闲人_飞踢.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运飞踢目标闲人站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运盾连击S目标},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_飞踢.posX},"Y":0,"Z":${飞踢闲人_飞踢.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_飞踢.posX},"Y":0,"Z":${飞踢闲人_飞踢.posY}}`;
            }
          }
          if (data.P5一运小电视.id==data.myId|| debugMode) {
            postAoe(`{"Name":"P5一运飞踢闲人电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_分摊电视.posX},"Y":0,"Z":${飞踢闲人_分摊电视.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运飞踢闲人电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运小电视.id},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_分摊电视.posX},"Y":0,"Z":${飞踢闲人_分摊电视.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_分摊电视.posX},"Y":0,"Z":${飞踢闲人_分摊电视.posY}}`;
            }
          }

          if (data.P5一运小电视.id!=data.P5一运远点名 && data.P5一运盾连击S目标!=data.P5一运远点名 && (data.P5一运远点名==data.myId || debugMode)) {
            postAoe(`{"Name":"P5一运远点名电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运远点名电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}}`;
            }
          }
          if (data.P5一运小电视.id!=data.P5一运远点名搭档 && data.P5一运盾连击S目标!=data.P5一运远点名搭档 && (data.P5一运远点名搭档==data.myId|| debugMode)){
            postAoe(`{"Name":"P5一运远点名搭档电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运远点名搭档电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}}`;
            }
          }
          if (data.P5一运小电视.id!=data.P5一运近点名 && data.P5一运盾连击S目标!=data.P5一运近点名 && (data.P5一运近点名==data.myId|| debugMode)) {
            postAoe(`{"Name":"P5一运近点名电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运近点名电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}}`;
            }
          }
          if (data.P5一运小电视.id!=data.P5一运近点名搭档 && data.P5一运盾连击S目标!=data.P5一运近点名搭档 && (data.P5一运近点名搭档==data.myId|| debugMode)) {
            postAoe(`{"Name":"P5一运近点名搭档电视站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
            postAoe(`{"Name":"P5一运近点名搭档电视站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
            if(!debugMode)
            {
              data.moveBuffer = `{"X":${飞踢闲人_分摊闲人.posX},"Y":0,"Z":${飞踢闲人_分摊闲人.posY}}`;
            }
          }

        }
      },
    },
    { id: 'TOP P5 一运小电视设置面向',
      type: 'StartsUsing',
      netRegex: { id: ['7B96','7B97']},
      //7B96 以A为北打西
      //7B97 以A为北打东
      delaySeconds:0.5,
      condition: (data) => data.阶段 === 'delta',
      run: async (data, matches) => {
        let rr = await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.sourceId, 16)],
        });
        let head=rr.combatants[0].Heading;
        if ((matches.id=='7B96' && data.P5一运小电视.effectId=='D7C')||(matches.id=='7B97' && data.P5一运小电视.effectId=='D7D')) {
          head=head+Math.PI;
        }
        if (data.P5一运小电视.id==data.myId) {
          setFace(head,9,5);
        }
      },
    },
    { id: 'TOP P5 一运你好远近世界引导点',
      type: 'StartsUsing',
      netRegex: { id: ['7B94','7B95']},
      run: (data, matches) => {
        let dur=10;
        // dur=999;
        let debugMode=false;


        let dx=1;
        if (matches.id=='7B94') dx=-1;
        let r=(data.P5眼睛+2);
        var 中心={posX:100,posY:100};
        var 攻击1=RotatePointFromCentre({posX:100+0.7*dx,posY:119.5},中心,45*r);
        var 攻击2=RotatePointFromCentre({posX:100+10.4*dx,posY:83.5},中心,45*r);
        var 攻击3=RotatePointFromCentre({posX:100+9.2*dx,posY:109.2},中心,45*r);
        var 攻击4=RotatePointFromCentre({posX:100+13.70*dx,posY:113.7},中心,45*r);
        var 锁链1=RotatePointFromCentre({posX:100+19.3*dx,posY:101.5},中心,45*r);
        var 锁链2=RotatePointFromCentre({posX:100+5.5*dx,posY:100},中心,45*r);
        var 闲人=RotatePointFromCentre({posX:100+17*dx,posY:90.8},中心,45*r);
        data.moveBuffer=undefined;
        data.moveBuffer2=undefined;

        if (data.P5一运远点名==data.myId || debugMode) {
          //postAoe(`{"Name":"P5一运远点名飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${锁链1.posX},"Y":0,"Z":${锁链1.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${锁链1.posX},"Y":0,"Z":${锁链1.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${锁链1.posX},"Y":0,"Z":${锁链1.posY}}`;
          }
        }
        if (data.P5一运远点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运远点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}}`;
          }
        }
        if (data.P5一运近点名==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近点名飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${锁链2.posX},"Y":0,"Z":${锁链2.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近点名飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名},"Centre2Type":"PostionValue","Centre2Value":{"X":${锁链2.posX},"Y":0,"Z":${锁链2.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${锁链2.posX},"Y":0,"Z":${锁链2.posY}}`;
          }
        }
        if (data.P5一运近点名搭档==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运远点名搭档飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近点名搭档},"Centre2Type":"PostionValue","Centre2Value":{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${闲人.posX},"Y":0,"Z":${闲人.posY}}`;
          }
        }

        if (data.P5一运近线[0][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线1飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${攻击1.posX},"Y":0,"Z":${攻击1.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线1飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${攻击1.posX},"Y":0,"Z":${攻击1.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${攻击1.posX},"Y":0,"Z":${攻击1.posY}}`;
          }
        }
        if (data.P5一运近线[0][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线2飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${攻击2.posX},"Y":0,"Z":${攻击2.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线2飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[0][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${攻击2.posX},"Y":0,"Z":${攻击2.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer = `{"X":${攻击2.posX},"Y":0,"Z":${攻击2.posY}}`;
          }
        }
        if (data.P5一运近线[1][0]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线3飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${攻击3.posX},"Y":0,"Z":${攻击3.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线3飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][0]},"Centre2Type":"PostionValue","Centre2Value":{"X":${攻击3.posX},"Y":0,"Z":${攻击3.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer2 = `{"X":${攻击3.posX},"Y":0,"Z":${攻击3.posY}}`;
          }
        }
        if (data.P5一运近线[1][1]==data.myId|| debugMode) {
          //postAoe(`{"Name":"P5一运近线4飞拳站位","AoeType":"Circle","CentreType":"PostionValue","CentreValue":{"X":${攻击4.posX},"Y":0,"Z":${攻击4.posY}},"Radius":0.5,"Color":1073807104,"Delay":0,"During":${dur}}`);
          //postAoe(`{"Name":"P5一运近线4飞拳站位连线","AoeType":"Link","CentreType":"ActorId","CentreValue":${data.P5一运近线[1][1]},"Centre2Type":"PostionValue","Centre2Value":{"X":${攻击4.posX},"Y":0,"Z":${攻击4.posY}},"Thikness":10,"Color":4278255360,"Delay":0,"During":${dur}}`);
          if(!debugMode)
          {
            data.moveBuffer2 = `{"X":${攻击4.posX},"Y":0,"Z":${攻击4.posY}}`;
          }
        }
      },
    }
  ],
  
});
