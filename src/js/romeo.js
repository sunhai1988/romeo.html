import { romeo } from 'romeo.lib'
import { toast } from 'react-toastify';

let romeoInstance = null;

export async function login(username, password, onChange, restoreString = null) {
  if (romeoInstance) {
    await romeoInstance.terminate();
  }
  romeoInstance = new romeo.Romeo({
    username, password, onChange
  });
  return await romeoInstance.init(restoreString)
}

export async function logout(returnBackup = false) {
  if (!romeoInstance) {
    return null;
  }
  return await romeoInstance.terminate(returnBackup);
}

export function get() {
  return romeoInstance
}

export function showInfo(message) {
  toast(message, {
    type: toast.TYPE.INFO,
    className: {
      //opacity: '0.7',
      top: "52px",
      right: "-10px",
    },
    autoClose: 3000
  });
}

export function linkToCurrentPage() {
  const romeo = get();
  const currentPage = romeo.pages.getCurrent();
  const currentPageNumber = currentPage ? currentPage.opts.index + 1 : null;
  return currentPageNumber ? `/page/${currentPageNumber}` : null;
}

const URL_MATCHES = {
  '\\/page\\/(\\d+)$': 'Page $1',
  '\\/page\\/(\\d+)/address/(.+)$': 'Address $2',
};

export function findRouteName (name) {
  const key = Object.keys(URL_MATCHES).find(k => name.match(k));
  if (!key) return;
  let value = URL_MATCHES[key];
  const match = name.match(key);
  [1,2,3,4,5].forEach(i => value = value.replace(`\$${i}`, match[i]));
  return value;
}