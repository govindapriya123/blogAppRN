import moment from 'moment';
const formatDate = (isoDate: any) => {
  console.log('isoDate', isoDate);
  const truncatedDate = isoDate?.slice(0, 23);
  return moment(truncatedDate).format('YYYY-MM-DD HH:mm');
};

const URL = 'http://localhost:8086/';
const profilePicURL='http://localhost:8086/uploads/profile'
export {formatDate, URL,profilePicURL};
