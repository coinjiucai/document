const Mock = require("mockjs");
import mockRole from "./mock-role";
import mockSystemManage from "@/mock/mock-system-manage";
// 组织和用户管理
import organizationAndUser from "@/mock/organization-and-user";

const mockList = [
  ...mockRole,
  ...mockSystemManage,
  ...organizationAndUser,
];
mockList.forEach((item) => {
  Mock.mock(item.url, item.response);
});
