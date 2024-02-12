import dotenv from 'dotenv';
dotenv.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const reader = require('g-sheets-api');
const { EmbedBuilder } = require('discord.js');

// searches pal spreadsheet for the given pal name, and if it doesn't have any results, 
// sends message into discord channel saying "No pal found!"
export async function searchPal(palName, message) {
  var palInfo;
  var isNo = 0;
  var found = 1;
  if (/^\d/.test(palName)) {
    isNo = 1;
    var readerOptions = {
      apiKey: process.env.GOOGLE_API,
      sheetId: process.env.PALS_SHEET,
      returnAllResults: false,
      filter: {
        'No.' : palName,
      },
    }
  }
  else {
    isNo = 0;
    var readerOptions = {
      apiKey: process.env.GOOGLE_API,
      sheetId: process.env.PALS_SHEET,
      returnAllResults: false,
      filter: {
        'Pal' : palName,
      },
    }
  };

  await reader(readerOptions, (results) => {
    if (Object.keys(results).length === 0) {
      found = 0;
      return;
    }
    var result = results[0];

    palInfo = {
      Name: result['Pal'],
      Number: result['No.'],
      Type: "",
      Attributes: [{"attr": "Kindling", "value" : result['kindling']}, {"attr" : "Planting", "value" : result['planting']}, 
                  {"attr" : "Handiwork", "value" : result['handiwork']}, {"attr" : "Lumbering", "value": result['lumbering']}, 
                  {"attr" : "Medicine", "value" : result['medicine']}, {"attr" : "Transporting", "value" : result['transporting']}, 
                  {"attr" : "Watering", "value" : result['watering']}, {"attr" : "Electricity", "value" : result['electricity']},
                  {"attr" : "Gathering", "value" : result['gathering']}, {"attr" : "Mining", "value" : result['mining']}, 
                  {"attr" : "Cooling", "value" : result['cooling']}, {"attr" : "Farming", "value" : result['farming']}],
      Loot: result['Loot'],
      Farming: result['Farming_prod'],
      Img: result['Image_link']
    };

    var types = result['Type'].split(',');
    for(var i = 0; i < types.length; i++) {
      switch (types[i]) {
        case 'D':
          palInfo['Type'] += "Dark";
          break;
        case 'N':
          palInfo['Type'] += "Neutral";
          break;
        case 'GD':
          palInfo['Type'] += "Ground";
          break;
        case 'GS':
          palInfo['Type'] += "Grass";
          break;
        case 'DG':
          palInfo['Type'] += "Dragon";
          break;
        case 'F':
          palInfo['Type'] += "Fire";
          break;
        case 'E':
          palInfo['Type'] += "Electric";
          break;
        case 'W':
          palInfo['Type'] += "Water";
          break;
        case 'I':
          palInfo['Type'] += "Ice";
          break;
      }

      if (i < types.length - 1) palInfo['Type'] += ", ";
    }
    palInfo['Attributes'] = palInfo['Attributes'].filter((object) => object.value > 0);
  });

  if (found) {
    let attributes = AttrAsString(palInfo['Attributes']);
    var send;
    switch (isNo) {
      case 1:
        send = `Number: ${palInfo['Number']}\nPal Name: ${palInfo['Name']}\nType: ${palInfo['Type']}\n${attributes}\n\Loot: ${palInfo['Loot']}\nFarming: ${palInfo['Farming']}\n${palInfo['Img']}`;
        break;
      case 0:
        send = `Pal Name: ${palInfo['Name']}\nNumber: ${palInfo['Number']}\nType: ${palInfo['Type']}\n${attributes}\nLoot: ${palInfo['Loot']}\nFarming: ${palInfo['Farming']}\n${palInfo['Img']}`;
        break;
    }

    if (arguments.length == 1) return send;
    else message.channel.send(send);
  }
  else {
    if (arguments.length == 1) return "No pal found!"
    else return message.channel.send("No pal found!");
  }
  
}

// searches pal spreadsheet for the given drop. If there are no results,
// sends message into discord channel saying "No item found!"
export async function searchItem(itemName, message) {
  var found = 1;
  var itemInfo = {
    Item : [],
    Pals : [],
    imageLink : ""
  };
  
  var palOptions = {
    apiKey: process.env.GOOGLE_API,
    sheetId: process.env.PALS_SHEET,
    returnAllResults: false,
    filter: {
      'Loot' : itemName
    },
  };

  var lootOptions = {
    apiKey: process.env.GOOGLE_API,
    sheetId: process.env.PALS_DROP_SHEET,
    returnAllResults: false,
    filter: {
      'Item' : itemName
    },
  };

  await reader(palOptions, (results) => {
    if (Object.keys(results).length === 0) {
      found = 0;
      return;
    }
    results.forEach((result, index) => {
      itemInfo['Pals'] += `No. ${result['No.']}, ${result.Pal}`;
      if (index < results.length - 1) itemInfo['Pals'] += ",\n";
    })
  });

  if (found) {
    await reader(lootOptions, (results) => {
      itemInfo['imageLink'] = results[0]['Image_Link'];
      itemInfo['Item'] = results[0].Item;
    });

    var send = `Item: ${itemInfo['Item']}\nPals that drop this:\n${itemInfo['Pals']}\nImage link: ${itemInfo['imageLink']}`
    console.log(send)
    if (arguments.length === 1) {
      return send
    }
    else message.channel.send(send);
  }
  else {
    if (arguments.length == 1) return "No item found!";
    else return message.channel.send("No item found!");
  }
  
}

//searchs pal spreadsheet for the given attribute, ordering from highest attr to lowest
export async function searchAttr(attrName, message) {
  var words = attrName.split(' ');
  if (words.length == 1) words[1] = '1';
  var attributes = ['kindling', 'planting', 'handiwork', 'lumbering', 'medicine', 'farming', 
                    'mining', 'cooling', 'gathering', 'transporting', 'watering', 'electricity']
  switch (words[0]) {
    case 'k':
      words[0] = 'kindling';
      break;
    case 'p':
      words[0] = 'planting';
      break;
    case 'h':
      words[0] = 'handiwork';
      break;
    case 'l':
      words[0] = 'lumbering';
      break;
    case 'med':
      words[0] = 'medicine';
      break;
    case 'f':
      words[0] = 'farming';
      break;
    case 'mi':
      words[0] = 'mining';
      break;
    case 'c':
      words[0] = 'cooling';
      break;
    case 'g':
      words[0] = 'gathering';
      break;
    case 't':
      words[0] = 'transporting';
      break;
    case 'w':
      words[0] = 'watering';
      break;
    case 'e':
      words[0] = 'electricity';
      break;
    default:
      if (!attributes.includes(words[0])){
        if (arguments.length == 1) return "Invalid attribute!";
        else return message.channel.send("Invalid attribute!");
      }
  }

  var palInfo = [];
  
  var readerOptions = {
    apiKey: process.env.GOOGLE_API,
    sheetId: process.env.PALS_SHEET,
    returnAllResults: false,
    filter: {
      [words[0]] : words[1]
    }
  };

  var send = `Selected attribute (value):\n${words[0][0].toUpperCase() + words[0].slice(1)} (${words[1]})\nPals with at least that value in the attribute:\n`
  switch (words[1]) {
    case '1':
      await reader(readerOptions, (results) => {
        results.forEach((result) => {
          palInfo.push({
            Name: result['Pal'],
            Number: result['No.'],
            AttrVal: result[words[0]]
          })
        });
      });
    case '2':
      readerOptions.filter[words[0]] = '2';
      await reader(readerOptions, (results) => {
        results.forEach((result) => {
          palInfo.push({
            Name: result['Pal'],
            Number: result['No.'],
            AttrVal: result[words[0]]
          })
        });
      });
    case '3':
      readerOptions.filter[words[0]] = '3';
      await reader(readerOptions, (results) => {
        results.forEach((result) => {
          palInfo.push({
            Name: result['Pal'],
            Number: result['No.'],
            AttrVal: result[words[0]]
          })
        });
      });
    case '4':
      readerOptions.filter[words[0]] = '4';
      await reader(readerOptions, (results) => {
        results.forEach((result) => {
          palInfo.push({
            Name: result['Pal'],
            Number: result['No.'],
            AttrVal: result[words[0]]
          })
        });
      });
      break;
    default:
      if (arguments.length == 1) return "Invalid value given!";
      else return message.channel.send("Invalid value given!");
  }; 
  palInfo = palInfo.reverse();
  palInfo.forEach((pal, index) => {
    send += `No. ${pal.Number}, ${pal.Name} (${pal.AttrVal})`;
    if (index < palInfo.length - 1) send += ",\n";
  });

  if (arguments.length == 1) return send;
  else message.channel.send(send);
};

//inexplicably broken so w/e skill search up was kind of silly anyway
// export async function searchSkill(skillName, message) {
//   const reader = require('g-sheets-api');
//   var skillInfo = {};
//   var readerOptions = {
//     apiKey: process.env.GOOGLE_API,
//     sheetId: process.env.PALS_SKILLS_SHEET,
//     returnAllResults: false,
//     filter: {
//       'Skill' : skillName
//     },
//   };

//   await reader(readerOptions, (results) => {
//     if (Object.keys(results).length === 0) return message.channel.send("Nothing found!");
//     var result = results[0];
//     skillInfo = {
//       Name: result['Skill'],
//       Element: "",
//       CT : result['CT'],
//       Power : result['Power'],
//       Desc : result['Description']
//     };

//     var types = result['Element'].split(',');
//     for(var i = 0; i < types.length; i++) {
//       switch (types[i]) {
//         case 'D':
//           skillInfo['Element'] += "Dark";
//           break;
//         case 'N':
//           skillInfo['Element'] += "Neutral";
//           break;
//         case 'GD':
//           skillInfo['Element'] += "Ground";
//           break;
//         case 'GS':
//           skillInfo['Element'] += "Grass";
//           break;
//         case 'DG':
//           skillInfo['Element'] += "Dragon";
//           break;
//         case 'F':
//           skillInfo['Element'] += "Fire";
//           break;
//         case 'E':
//           skillInfo['Element'] += "Electric";
//           break;
//         case 'W':
//           skillInfo['Element'] += "Water";
//           break;
//         case 'I':
//           skillInfo['Element'] += "Ice";
//           break;
//       }
//       if (i < types.length - 1) skillInfo['Element'] += ", ";
//     }
//     message.channel.send(`Skill: ${skillInfo['Name']},\nElement: ${skillInfo['Element']},\nCT: ${skillInfo['CT']},
//                          \nPower: ${skillInfo['Power']},\nSkill Description: ${skillInfo['Desc']}`);
//   });
// }

function AttrAsString(attributes){
    return attributes.reduce((str, { attr, value }) => `${str}${str ? '\n' : ''}${attr}: ${value}`, '')
}