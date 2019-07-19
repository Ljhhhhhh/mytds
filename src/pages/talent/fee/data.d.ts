// export interface TableListItem {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   title: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: number;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// }

export interface TableListItem {
  id: number;
  createdTime: any;
  productModel: string;
  channelNickname: string;
  wechatNickname: string;
  mainChannel: string;
  mainChannelFansNumber: number;
  talentMarking: -1 | 1 | 2;
  followUpDate: any;
  createdAdminId: string;
  phoneNumber?: string;
  wechatAccount?: string;
  Introduction?: string;
  totalFanEstimate?: string;
  getInformation?: string;
  isDelivery?: 0 | 1;
  is_refund?: 0 | 1;
  is_evaluate?: 0 | 1;
  createrId?: number;
  sourcesInformation?: string;
  otherList: [{
    content?: string;
    ditch?: string;
    read?: string;
    evaluationReward?: string;
  }]
}



export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListDate {
  list: any; //TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
