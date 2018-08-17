import * as rich from "discord-rich-presence"
import { sprintf } from "sprintf-js"
import { hidden } from "./hidden"
const emulate = false

const client = rich.default('424933941645017108');
const startDay = [2018, 8, 20]
const days = 25
const start = new Date(startDay[0], startDay[1] - 1, startDay[2], 14, 0, 0)
const end = new Date(start.getTime())
end.setDate(end.getDate() + days)
end.setHours(12, 0, 0)
console.log("Start: " + start)
console.log("End: " + end)
let lastHour = -1

const time = Math.floor(Date.now() / 1000)
const timer = setInterval(refreshRPC, 15000)

let i = start.getTime()
let index = 0

refreshRPC()

function refreshRPC() {
  if (emulate) {
    i += 1000 * 3600 * (5 + Math.floor(Math.random() * 3))
    console.log("Emulate time: " + new Date(i))
  }
  try {
    client.updatePresence({
      state: getProgress(),
      details: getDescription(),
      startTimestamp: start,
      endTimestamp: end,
      largeImageKey: getImage(),
      largeImageText: getHiddenText(),
      // smallImageKey: 'neko_preta',
      instance: true,
    });
  } catch {
    // :)
  }
}
function getProgress() {
  const now = getNow()
  const left = (now - start.getTime()) / (end.getTime() - start.getTime()) * 100
  const leftNum = Math.floor((end.getTime() - now) / 1000)
  const leftDay = Math.floor(leftNum / 86400)
  const leftHour = Math.ceil((leftNum % 86400) / 3600)
  return sprintf("%d일 %d시간 (%.3f%%)", leftDay, leftHour, left)
}
function getDescription() {
  if (getNow() < start.getTime()) {
    return "준비 중"
  }
  const clock = normalize(getNow())
  const holiday = new Date(getNow()).getDay() % 6 === 0
  if (clock.hour >= 22 || (holiday && clock.hour < 7) || (!holiday && clock.hour < 6)) {
    return "불침번 서거나 수면"
  }
  if (holiday) {
    return "불-편한 휴일"
  } else {
    return "몸쓰는 노오력"
  }
}
function getImage() {
  const nowH = new Date(getNow()).getHours()
  if (getNow() < start.getTime()) {
    return "start"
  } else {
    if (Math.random() < 0.03) {
      return "neko_preta"
    } else {
      if (getDescription().indexOf("수면") >= 0) {
        return "black"
      } else if (nowH <= 12) {
        return "start"
      } else {
        return "byongsin"
      }
    }
  }
}
function normalize(date:number) {
  const nm = new Date(start.getTime())
  nm.setHours(0, 0, 0)
  const delta = Math.floor((date - nm.getTime()) / 1000)
  const pureDay = Math.ceil(delta / 86400)
  const pureHour = Math.floor((delta % 86400) / 3600)
  return {
    day: pureDay,
    hour: pureHour
  }
}
function getHiddenText() {
  const t = normalize(getNow())
  if (t.hour !== lastHour) {
    lastHour = t.hour
    index = Math.min(hidden.length - 1, Math.floor(Math.random() * hidden.length))
  }
  if (getNow() < start.getTime()) {
    return "가기 싫다"
  } else {
    return hidden[index]
  }
}
function getNow() {
  return emulate ? i : Date.now()
}