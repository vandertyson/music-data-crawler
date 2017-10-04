# Setup
- Cai NodeJS ban Stable
- Clone
- npm install
- cai chrome web driver 
`https://chromedriver.storage.googleapis.com/index.html?path=2.32/`
- moi file merge-data-{number}.xlsx chua name + artist 500 bai hat. 

# Download audio file: dung trang mp3juice.cc
- sua duong dan thu muc luu nhac trong juiced.js
`var downloadFilepath = "D:/songs"; //luu bai hat vao duong dan nay`
- sua thoi gian doi download xong bai hat (cai nay can chinh theo toc do mang :D)
`var downloadTime = 15000; //doi 15s download cho moi bai hat`
- de test download (3 bai) chay download file merge-data-5
`node juiced.js 5`
- de download file nhac cua merge-data-1.xlsx chay 
`node juiced.js 1`
- tuong tu de download file nhac cua merge-data-2.xlsx chay 
`node juiced.js 2`
- Output la 1 file '1-audio.xlsx' chua ten file audio. Duong dan den file la duong dan den thu muc download cua Chrome + tenfile

# Download image va genre: dung discogs.com
- tuong tu nhu download nhac. 
- vd de download genre cho merge-data-1.xlsx
`node genre.js 1`
- vd de download art cho merge-data-2.xlsx
`node art.js 2`
  
