import {
  LocalStorageProvider,
  SessionStorageProvider,
} from "./storage.provider";

describe("Storage providers", () => {
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it("stores values in local storage", () => {
    jest.spyOn(Storage.prototype, "setItem");
    const sut = new LocalStorageProvider();
    sut.store("test", "foo");
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("test", "foo");
  });

  it("deleted key if null value is passed from local storage", () => {
    jest.spyOn(Storage.prototype, "removeItem");
    const sut = new LocalStorageProvider();
    sut.store("test", null);
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith("test");
  });

  it("retrieves values from local storage", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => "bar");

    const sut = new LocalStorageProvider();
    const value = sut.retrieve("foo");
    expect(value).toEqual("bar");
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith("foo");
  });

  it("clears the value from local storage", () => {
    jest.spyOn(Storage.prototype, "removeItem");
    const sut = new LocalStorageProvider();
    sut.clear("foo");
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith("foo");
  });

  it("stores values in session storage", () => {
    jest.spyOn(Storage.prototype, "setItem");
    const sut = new SessionStorageProvider();
    sut.store("test", "foo");
    expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("test", "foo");
  });

  it("deleted key if null value is passed from session storage", () => {
    jest.spyOn(Storage.prototype, "removeItem");
    const sut = new SessionStorageProvider();
    sut.store("test", null);
    expect(sessionStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith("test");
  });

  it("retrieves values from session storage", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => "bar");
    const sut = new SessionStorageProvider();
    const value = sut.retrieve("foo");
    expect(value).toEqual("bar");
    expect(sessionStorage.getItem).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem).toHaveBeenCalledWith("foo");
  });

  it("clears the value from session storage", () => {
    jest.spyOn(Storage.prototype, "removeItem");
    const sut = new SessionStorageProvider();
    sut.clear("foo");
    expect(sessionStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith("foo");
  });
});
