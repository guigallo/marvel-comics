export default class ComicHelper {
  static dateToString(date) {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
  };

  static urlImg(comic) {
    const img = comic.image;
    return `${img.path}.${img.extension}`;
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
}