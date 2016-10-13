var fs = require('fs');
var path = require('path');
var validator = require('validator');
const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
const AdGroup = mongoose.model('AdGroup');

export async function adList(ctx) {
  const page = parseInt(ctx.query.page) > 0 ? parseInt(ctx.query.page) : 1;
  const perPage = parseInt(ctx.query.perPage) > 0 ? parseInt(ctx.query.perPage) : 50;
  const startRow = (page - 1) * perPage;

  const count = await Ad.count();
  const ads = await Ad.find({}).skip(startRow).limit(perPage).sort('-weight');

  const items = [];
  for(let ad of ads){
    let item = ad.toObject();
    const groups = await AdGroup.find({ads:item._id}, 'name');
    item.groups = [];
    for(let group of groups){
      item.groups.push(group.name);
    }
    items.push(item);
  }

  return ctx.render('console/ad/list', {items: items, page: {currentPage: page, total: Math.ceil(count / perPage), base: '/console/ad'}});
}

export async function showCreateAd(ctx) {
  return ctx.render('console/ad/edit');
}

export async function createAd(ctx) {
  if (!ctx.body.imgName) return ctx.render('console/ad/edit', {error: '请输入图片名称'});
  if (!ctx.body.url) return ctx.render('console/ad/edit', {error: '请输入链接'});

  const body = {};
  body.imgName = ctx.body.imgName;
  body.url = ctx.body.url;
  if (ctx.body.name)body.name = ctx.body.name;
  if (ctx.body.des)body.des = ctx.body.des;
  if (ctx.body.weight)body.weight = ctx.body.weight;
  body.isS = !!ctx.body.isS;
  body.isA = !!ctx.body.isA;
  body.isWX = !!ctx.body.isWX;
  body.disable = !!ctx.body.disable;

  await Ad.create(body);
  return ctx.redirect('/console/ad');
}

export async function showEditAd(ctx) {
  var id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  const ad = await Ad.findById(id)
  if (!ad)return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  return ctx.render('console/ad/edit', {action: 'edit', ad})
}

export async function editAd(ctx) {
  var id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  const ad = await Ad.findById(id)
  if (!ad)return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  if (ctx.body.imgName)ad.imgName = ctx.body.imgName;
  if (ctx.body.url) ad.url = ctx.body.url;
  if (ctx.body.name)ad.name = ctx.body.name;
  if (ctx.body.des)ad.des = ctx.body.des;
  if (ctx.body.weight)ad.weight = ctx.body.weight;
  ad.isS = !!ctx.body.isS;
  ad.isA = !!ctx.body.isA;
  ad.isWX = !!ctx.body.isWX;
  ad.disable = !!ctx.body.disable;
  await ad.save();

  return ctx.redirect('/console/ad');
}

export async function groupList(ctx) {
  const page = parseInt(ctx.query.page) > 0 ? parseInt(ctx.query.page) : 1;
  const perPage = parseInt(ctx.query.perPage) > 0 ? parseInt(ctx.query.perPage) : 50;
  const startRow = (page - 1) * perPage;

  const count = await AdGroup.count();
  const groups = await AdGroup.find({}).populate('ads').skip(startRow).limit(perPage).sort('-weight');

  return ctx.render('console/ad_group/list', {items: groups, page: {currentPage: page, total: Math.ceil(count / perPage), base: '/console/group'}});
}

export async function showCreateGroup(ctx) {
  const ads = await Ad.find({disable: false}).sort('-weight');
  return ctx.render('console/ad_group/edit', {adList: ads});
}

export async function createGroup(ctx) {
  var name = validator.trim(ctx.body.name);
  if (!name) {
    const ads = await Ad.find({disable: false});
    return ctx.render('console/ad_group/edit', {error: '请输入渠道名称', adList: ads});
  }

  var des = validator.trim(ctx.body.des);
  var cnzz_id = validator.trim(ctx.body.cnzz_id);
  var weight = validator.trim(ctx.body.weight);
  var isS = !!ctx.body.isS;
  var isA = !!ctx.body.isA;
  var isWX = !!ctx.body.isWX;
  var canClose = !!ctx.body.canClose;
  var disable = !!ctx.body.disable;

  var ads = [];
  if (ctx.body.ads) {
    if (ctx.body.ads instanceof Array) {
      for (let adId of ctx.body.ads) {
        if (mongoose.Types.ObjectId.isValid(adId))ads.push(adId)
      }
    } else if (mongoose.Types.ObjectId.isValid(ctx.body.ads)) {//只选择一个的时候
      ads.push(ctx.body.ads)
    }
  }

  await AdGroup.create({name, des, cnzz_id, weight, disable, ads, isS, isA, isWX, canClose});
  return ctx.redirect('/console/group');
}

export async function showEditGroup(ctx) {
  var id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  const group = await AdGroup.findById(id)
  if (!group)return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  const ads = await Ad.find({disable: false}).sort('-weight');
  return ctx.render('console/ad_group/edit', {action: 'edit', group, adList: ads})
}

export async function editGroup(ctx) {
  var id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  const group = await AdGroup.findById(id)
  if (!group)return ctx.render('console/notify/notify', {error: '此列表项不存在或已被删除。'});

  var name = validator.trim(ctx.body.name);
  if (name) group.name = name;

  var des = validator.trim(ctx.body.des);
  var cnzz_id = validator.trim(ctx.body.cnzz_id);
  var weight = validator.trim(ctx.body.weight);
  var isS = !!ctx.body.isS;
  var isA = !!ctx.body.isA;
  var isWX = !!ctx.body.isWX;
  var canClose = !!ctx.body.canClose;
  var disable = !!ctx.body.disable;
  var ads = [];
  if (ctx.body.ads) {
    if (ctx.body.ads instanceof Array) {
      for (let adId of ctx.body.ads) {
        if (mongoose.Types.ObjectId.isValid(adId))ads.push(adId)
      }
    } else if (mongoose.Types.ObjectId.isValid(ctx.body.ads)) {//只选择一个的时候
      ads.push(ctx.body.ads)
    }
  }

  group.des = des;
  group.cnzz_id = cnzz_id;
  group.weight = weight;
  group.isS = isS;
  group.isA = isA;
  group.isWX = isWX;
  group.canClose = canClose;
  group.disable = disable;
  group.ads = ads;

  await group.save();
  return ctx.redirect('/console/group');
}
