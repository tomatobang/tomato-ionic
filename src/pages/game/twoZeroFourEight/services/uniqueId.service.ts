export class UniqueIdService {
  generate(): string {
    function S4() {
      return (((1 + Math.random()) * 0x10000)).toString(16).substring(1); //  | 0
    }
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }
}

export const uniqueIdService: UniqueIdService = new UniqueIdService();
