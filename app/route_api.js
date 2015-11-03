var express = require('express');
var router = express.Router();

var rooms = {};
exports.route = function (app) {
    // 商品详情
    router.get('/guess/actionGoodsInfoList-*.htm', function (req, res) {

        res.jsonp({
            resultCode: 0,
            actionInfo: {
                actionId: 123,
                initialGuessCount: 1000,
                actionStartTime: 1445323625300,
                actionEndTime: 1445573060287,
            },
            goodsInfoList: [
                {partNumber: '000000000120875598', partName: '你说  接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛', price: 888, goodsId: '7890'},
                {partNumber: '000000000120875598', partName: '你说接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛', price: 1253, goodsId: '7891'},
                {partNumber: '000000000120875598', partName: '你说接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛你说接口没有数据我玩个毛', price: 532, goodsId: '7893'}
            ]
        });
    });

    //合计人数
    router.get('/guess/queryCurrentUserCount-*.htm', function (req, res) {
        res.jsonp({
            currentUserCount: '444'
        });
    });

    router.get('/guess/queryLastWinningList-*.htm', function (req, res) {
        res.jsonp({
            firstWinList: [{phoneNumber: '15651777767', partName: '佳能佳能佳能佳能'}, {
                phoneNumber: '15651777767',
                partName: 'pee'
            }],
            secondWinList: [{phoneNumber: '15695290520', partName: '二蛋二蛋二蛋二蛋'}, {
                phoneNumber: '15651777767',
                partName: '能不能玩儿'
            }]
        })
    })

    router.get('/guess/queryMyGuessRecord.do', function (req, res) {
        res.jsonp([
            {
                winningId: 111,
                actionId: 123,
                goodsId: '32213',
                partNumber: '000000000120875598',
                partName: '佳能',
                guessPrice: 888,
                price: 9999,
                userGuessPrice: 777,
                winningType: 1
            },
            {
                winningId: 111,
                actionId: 123,
                goodsId: '32213',
                partNumber: '000000000120875598',
                partName: '佳能',
                guessPrice: 888,
                price: 9999,
                userGuessPrice: 777,
                winningType: 3
            },
            {
                winningId: 111,
                actionId: 123,
                goodsId: '32213',
                partNumber: '000000000120875598',
                partName: '佳能',
                guessPrice: 888,
                price: 9999,
                userGuessPrice: 777,
                winningType: 2
            }
        ])
    })

    router.get('/guess/guessPrice.do', function (req, res) {
        res.jsonp({
            resultCode: 4,
            winningType: 2,
            winningId:'0987fdsa',
            ldpUrl: 'http://www.suning.com'
        })
    })

    router.get('/guess/addGuessNumber.do', function (req,res) {
        res.jsonp({
            resultCode:'0'
        })
    })

    router.get('/guess/saveUserPhoneNumber.do', function (req, res) {
        res.jsonp({
            resultCode:0
        })
    })

    router.get('/guess/getUserGuessAndShareCount.do', function (req,res) {
        res.jsonp({
            resultCode:'1',
            guessRemainCount:0,
            shareRemainCount:2,
            guessCount:1
        })
    })

    app.use('/', router);
}