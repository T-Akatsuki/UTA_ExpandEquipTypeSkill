//=============================================================================
// UTA_ExpandEquipTypeSkill.js
//=============================================================================
/*:
 * @plugindesc This plugin can create skills to add equipable type.
 * @author T.Akatsuki
 * 
 * @help # Overview
 * This plugin can create skills to add equipable type.
 * Weapon and armor are both compatible.
 * 
 * Please setting meta parameter to Skill's note.
 * If actor learned those skill, adding equipable type.
 * 
 * # Meta Parameters
 * UTA_ExpandEquipTypeWId
 *   Specify to make equipable weapon ID.
 * UTA_ExpandEquipTypeAId
 *   Specify to make equipable armor ID.
 * 
 * If you want to set multiple, put comma(",") between IDs.
 * Using "-", the range can be specified.
 * 
 * # Example : settings of meta parameters
 * <UTA_ExpandEquipTypeWId:1>
 *   -> Possible to equip weapon with ID 1.
 * <UTA_ExpandEquipTypeAId:1,5,10>
 *   -> Possible to equip armor with ID 1, 5, 10.
 * <UTA_ExpandEquipTypeWId:1-10>
 *   -> Possible to equip weapon with ID 1-10.
 * 
 * # Plugin Commands
 * This Plugin does not provide plugin commands.
 * 
 * # Plugin Info
 * Version     : 1.0.0
 * Last Update : September 30th, 2018
 * Author      : T.Akatsuki
 * Web Page    : https://www.utakata-no-yume.net
 * License     : MIT License
 * (https://www.utakata-no-yume.net/gallery/rpgmv/plugin/license.html)
 * 
 * # Change Log
 * ver 1.0.0 (September, 30th, 2018)
 *   First release.
 */
/*:ja
 * @plugindesc 装備可能種別を増やすスキルを作成できるようにするプラグインです。
 * @author 赤月 智平
 * 
 * @help ■プラグインの概要
 * 装備可能種別を増やすスキルを作成できるようにするプラグインです。
 * 武器、防具どちらも対応しています。
 * 
 * スキルのメモ欄に対応するメタパラメーターを記述する事で
 * そのスキルを習得しているキャラクターの装備可能種類が拡張されます。
 * 
 * ■メタパラメーター
 * UTA_ExpandEquipTypeWId
 *   装備可能にする武器IDを指定します。
 * UTA_ExpandEquipTypeAId
 *   装備可能にする防具IDを指定します。
 * 
 * 拡張する装備種類のIDを指定します。
 * IDはカンマ(,)区切りで複数記述できます。
 * また、ハイフン(-)で範囲指定する事が可能です。
 * 
 * ■メタパラメーターの設定例
 * <UTA_ExpandEquipTypeWId:1>
 *   -> ID: 1の武器を装備可能にする。
 * <UTA_ExpandEquipTypeAId:1,5,10>
 *   -> ID: 1, 5, 10の防具を装備可能にする。
 * <UTA_ExpandEquipTypeWId:1-10>
 *   -> ID: 1～10の武器を装備可能にする。
 * 
 * ■プラグインコマンド
 * プラグインコマンドはありません。
 * 
 * ■プラグインの情報
 * バージョン : 1.0.0
 * 最終更新日 : 2018.09.30
 * 制作者     : 赤月 智平
 * Webサイト  : https://www.utakata-no-yume.net
 * ライセンス : MIT License
 * (https://www.utakata-no-yume.net/gallery/rpgmv/plugin/license.html)
 * 
 * ■更新履歴
 * ver 1.0.0 (2018.09.30)
 *   初版。
 */
//=============================================================================

var utakata = utakata || {};
(function(utakata){
    "use strict";
    utakata.ExpandEquipTypeSkill = (function(){
        var __VERSION__     = "1.0.0";
        var __PLUGIN_NAME__ = "UTA_ExpandEquipTypeSkill";

        /**
         * 装備IDと対応許可スキルの対応リスト
         * @type {Array}
         */
        ExpandEquipTypeSkill._weaponIdSkillMap = [];
        ExpandEquipTypeSkill._armorIdSkillMap  = [];

        ExpandEquipTypeSkill._metaTag = {
            "equipableWeaponId": "UTA_ExpandEquipTypeWId",
            "equipableArmorId" : "UTA_ExpandEquipTypeAId"
        };

        function ExpandEquipTypeSkill(){ 
            throw new Error("utakata.ExpandEquipTypeSkill is static class.");
        }

        /**
         * 初期化処理
         * 各種データベースが読み込まれた後に処理
         * @method _initialize
         */
        ExpandEquipTypeSkill._initialize = function(){
            this._makeEquipIdSkillMap();
        };

        ExpandEquipTypeSkill._makeEquipIdSkillMap = function(){
            this._weaponIdSkillMap = [];
            this._armorIdSkillMap  = [];
            this._weaponIdSkillMap = $dataSystem.weaponTypes.map(function(){ return []; });
            this._armorIdSkillMap  = $dataSystem.armorTypes.map(function(){ return []; });

            for(var i = 0; i < $dataSkills.length; i++){
                var item = $dataSkills[i];
                if(!item){
                    continue;
                }
                var _skillId = item.id;
                // weapon
                var _equipableWeaponIds = this._getEquipableWeaponIds(item);
                for(var j = 0; j < _equipableWeaponIds.length; j++){
                    var _wId = _equipableWeaponIds[j];
                    if(_wId > this._weaponIdSkillMap.length - 1){
                        // invalid id
                        continue;
                    }
                    this._weaponIdSkillMap[_wId].push(_skillId);
                }

                // armor
                var _equipableArmorIds = this._getEquipableArmorIds(item);
                for(var j = 0; j < _equipableArmorIds.length; j++){
                    var _aId = _equipableArmorIds[j];
                    if(_aId > this._armorIdSkillMap.length - 1){
                        // invalid id
                        continue;
                    }
                    this._armorIdSkillMap[_aId].push(_skillId);
                }
            }
        };

        ExpandEquipTypeSkill._getEquipableWeaponIds = function(item){
            return this._getEquipableIds(item, this._metaTag.equipableWeaponId);
        };

        ExpandEquipTypeSkill._getEquipableArmorIds = function(item){
            return this._getEquipableIds(item, this._metaTag.equipableArmorId);
        };

        ExpandEquipTypeSkill._getEquipableIds = function(item, paramName){
            if(!DataManager.isSkill(item)){
                console.error("utakata.ExpandEquipTypeSkill, _getEquipableIds: invalid item.");
                return [];
            }
            if(!(paramName in item.meta)){
                return [];
            }

            var _delimiter      = ",";
            var _equipableIds = item.meta[paramName].split(_delimiter);

            var ret = [];
            for(var i = 0; i < _equipableIds.length; i++){
                try{
                    var _str = _equipableIds[i];
                    // remove redundant space
                    _equipableIds[i] = _str.trim();

                    // single id (e.g. "1")
                    var _resultSingleMatch = _equipableIds[i].match(/^[0-9]+$/g);
                    if(_resultSingleMatch){
                        _resultSingleMatch.map(function(x){
                            var _singleId = Number(x);
                            // check NaN
                            if(_singleId !== _singleId){
                                throw new Error("invalid format. skill id = " + item.id + ", " + paramName + ": " + _equipableIds);
                            }
                            ret.push(_singleId);
                        });
                        continue;
                    }

                    // specify range (e.g. "1-10")
                    var _resultRangeMatch = _equipableIds[i].match(/^([0-9]+)-([0-9]+)$/);
                    if(_resultRangeMatch){
                        var _sId = Number(_resultRangeMatch[1]);
                        var _eId = Number(_resultRangeMatch[2]);
                        if(_sId > _eId){
                            throw new Error("invalid format. skill id = " + item.id + ", " + paramName + ": " + _equipableIds);
                        }
                        for(var _i = _sId; _i <= _eId; _i++){
                            ret.push(_i);
                        }
                        continue;
                    }

                    // invalid format
                    throw new Error("invalid format. skill id = " + item.id + ", " + paramName + ": " + _equipableIds);
                }catch(e){
                    console.error("utakata.ExpandEquipTypeSkill, _getEquipableIds: " + e.message, e.stack);
                }
                continue;
            }
            // uniq
            ret = ret.filter(function(_id, _index, _self){
                return _self.indexOf(_id) === _index;
            });
            return ret;
        };

        ExpandEquipTypeSkill.onLoadData = function(object){
            // $dataSkills, $dataSystemの準備ができ次第初期化処理
            if(!(object === $dataSkills) && !(object === $dataSystem)){
                return;
            }
            if($dataSkills && $dataSystem){
                this._initialize();
            }
        };

        /**
         * 引数で与えた武器種別の装備に対応した装備可能スキルをActorが習得しているかを返す
         * @param {Game_Actor} actor 
         * @param {Object} item weapon item object
         * @return {boolean}
         */
        ExpandEquipTypeSkill.hasExpandEquipTypeSkillW = function(actor, item){
            var ret = false;
            try{
                var skillIds = this._weaponIdSkillMap[item.wtypeId];
                for(var i = 0; i < skillIds.length; i++){
                    if(actor.isLearnedSkill(skillIds[i])){
                        ret = true;
                        break;
                    }
                    continue;
                }
            }catch(e){
                console.error("utakata.ExpandEquipTypeSkill, hasExpandEquipTypeSkillW: failed to check skill.", e.message, e.stack);
            }
            return ret;
        };

        /**
         * 引数で与えた防具種別の防具に対応した装備可能スキルをActorが習得しているかを返す
         * @param {Game_Actor} actor 
         * @param {Object} item armor item object
         * @return {boolean}
         */
        ExpandEquipTypeSkill.hasExpandEquipTypeSkillA = function(actor, item){
            var ret = false;
            try{
                var skillIds = this._armorIdSkillMap[item.atypeId];
                for(var i = 0; i < skillIds.length; i++){
                    if(actor.isLearnedSkill(skillIds[i])){
                        ret = true;
                        break;
                    }
                    continue;
                }
            }catch(e){
                console.error("utakata.ExpandEquipTypeSkill, hasExpandEquipTypeSkillA: failed to check skill.", e.message, e.stack);
            }
            return ret;
        };

        ExpandEquipTypeSkill.getPluginName = function(){ return __PLUGIN_NAME__; };
        ExpandEquipTypeSkill.getPluginVersion = function(){ return __VERSION__; };

        return ExpandEquipTypeSkill;
    })();

    // -------------------------------------------------------------------
    // DataManager
    // -------------------------------------------------------------------
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object){
        _DataManager_onLoad.apply(this, arguments);
        utakata.ExpandEquipTypeSkill.onLoadData(object);
    };

    // -------------------------------------------------------------------
    // Game_Actor
    // -------------------------------------------------------------------
    Game_Actor.prototype.canEquipWeapon = function(item){
        return (this.isEquipWtypeOk(item.wtypeId) || utakata.ExpandEquipTypeSkill.hasExpandEquipTypeSkillW(this, item)) && !this.isEquipTypeSealed(item.etypeId);
    };

    Game_Actor.prototype.canEquipArmor = function(item){
        return (this.isEquipAtypeOk(item.atypeId) || utakata.ExpandEquipTypeSkill.hasExpandEquipTypeSkillA(this, item)) && !this.isEquipTypeSealed(item.etypeId);
    };
})(utakata);
