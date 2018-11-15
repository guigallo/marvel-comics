export default class ComicHelper {
  static dateToString(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  static urlImg(comic) {
    const img = comic.image;
    if (img !== undefined) {
      return `${img.path}.${img.extension}`;
    } else {
      return 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/clean.jpg';
    }
  }

  static urlImgFirst(comic) {
    const img = comic.images[0];
    if(img !== undefined) {
      return `${img.path}.${img.extension}`;
    } else {
      return 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/clean.jpg';
    }
  }

  static urlMarvel(comic) {
    const detail = comic.urls.find(url => url.type === 'detail');
    if(detail !== undefined) {
      return detail.url;
    } else {
      return '';
    }
  }

  static getWriter(comic) {
    const writer = comic.creators.find(creator => creator.role === 'writer');
    if(writer !== undefined) {
      return writer.name;
    } else {
      return '';
    }
  }

  static onsaleDate(comic) {
    const dateText = comic.dates.find(date => date.type === 'onsaleDate');
    const date = new Date(dateText.date);
    if(date !== undefined) {
      return this.dateToString(date);
    } else {
      return '';
    }
  }

  static firstLeterUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}