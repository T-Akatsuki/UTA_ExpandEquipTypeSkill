# UTA_ExpandEquipTypeSkillプラグイン

## ■概要 : Overview
装備可能種別を増やすスキルを作成できるようにするプラグインです。  
武器、防具どちらにも対応しています。  

スキルのメモ欄に対応するメタパラメーターを記述する事で  
そのスキルを習得しているキャラクターの装備可能種類が拡張されます。

## ■利用方法 : Usage
ご自身のプロジェクトにUTA_ExpandEquipTypeSkill.jsを配置し、プラグインの有効化を行って下さい。  
スキルにメタパラメーターを設定し、追加したい装備種別を設定して下さい。

詳しい利用方法はWebサイトに掲載しておりますのでご一読下さい。  
https://www.utakata-no-yume.net/gallery/rpgmv/plugin/expand_equip_type_skill/

## ■メタパラメーター : Meta Parameters
スキルのメモ欄に追加する装備種別の設定をメタパラメーターで記述します。  

設定するIDはカンマ(,)区切りで複数記述できます。  
また、ハイフン(-)で範囲指定する事が可能です。

### UTA_ExpandEquipTypeWId
装備可能にする武器IDを指定します。

### UTA_ExpandEquipTypeAId
装備可能にする防具IDを指定します。

## ■メタパラメーターの設定例 : Example of settings
<UTA_ExpandEquipTypeWId:1>
  -> ID: 1の武器を装備可能にする。
<UTA_ExpandEquipTypeAId:1,5,10>
  -> ID: 1, 5, 10の防具を装備可能にする。
<UTA_ExpandEquipTypeWId:1-10>
  -> ID: 1～10の武器を装備可能にする。

## ■プラグインパラメーター : Plugin Parameters
プラグインパラメーターはありません。

## ■プラグインコマンド : Plugin Commands
プラグインコマンドはありません。

## ■更新履歴 : Change Log
### ver 1.0.0 (2018.09.30)
初版。

## ■ライセンス/利用規約 : License
本プラグインは[MIT License](LICENSE)です。  
商用/非商用問わずにご利用いただけます。

## ■連絡先 : Content Information

|  |  |
|:---:|:---|
| Author | 赤月 智平(T.Akatsuki) |
| WebSite | https://www.utakata-no-yume.net |
| Twitter | [@T_Akatsuki](https://twitter.com/t_akatsuki) |
| GitHub | https://github.com/T-Akatsuki |
