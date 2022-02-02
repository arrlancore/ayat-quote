export function randomIntFromInterval(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

type ayatObj = {
  id: string
  idn: string
  ar: string
}
export async function getRandomAyat(): Promise<[ayatObj, number, string]> {
  const surahNumber = randomIntFromInterval(114)
  const surah = await fetch(
    `https://raw.githubusercontent.com/arrlancore/dataquran/main/${surahNumber}.json`
  )
    .then((res) => res.json())
    .then((res) => res)

  const ayatNumber = randomIntFromInterval(surah.jumlah_ayat)
  return [surah.ayat[ayatNumber - 1], ayatNumber, surah.nama_latin]
}

export async function generateCaptionIg(
  surah: string,
  ayatNumber: number,
  ayatObj: ayatObj,
  account: string,
  mainHashTag: string,
  additionalHashtag: string
) {
  const template = `

Allah subhanahu wa ta'ala berfirman

${ayatObj.ar}

${ayatObj.idn}..
QS. ${surah} : ${ayatNumber}


➖➖➖

🔽 Dukung kami dengan cara 🔽

.

Follow ${account}

Follow ${account}

Follow ${account}

.

Jangan lupa "LIKE" ❤️

Dan TAG Sahabatmu 😊

Hastag #${mainHashTag}

➖➖➖

🌿Bebas repost tanpa izin 🔄

.

.

#quran #motivasitahfidz #nasehatquran #tilawah #murojaah #onedayoneayat #onedayonejuz #gauldenganquran #hafidz #hafidzquran #salimbahanan #quranvoice #quranrecitation #ahlulquran #alquran #tadabbur #tadabburquran #janganlupangaji #selfreminder #hijrah #pemudahijrah #chargeriman #boosteriman  #teladan #ayatoftheday ${additionalHashtag}
`
  return template
}
