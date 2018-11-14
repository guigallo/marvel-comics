export default class ComicHelper {
  static dateToString(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  static urlImg(comic) {
    const img = comic.image;
    return `${img.path}.${img.extension}`;
  }

  static urlImgFirst(comic) {
    const img = comic.images[0];
    return `${img.path}.${img.extension}`;
  }

  static urlMarvel(comic) {
    const detail = comic.urls.find(url => url.type === 'detail');
    return detail.url;
  }

  static getWriter(comic) {
    const writer = comic.creators.find(creator => creator.role === 'writer');
    return writer.name;
  }

  static onsaleDate(comic) {
    const dateText = comic.dates.find(date => date.type === 'onsaleDate');
    const date = new Date(dateText.date);
    return this.dateToString(date);
  }

  static firstLeterUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}