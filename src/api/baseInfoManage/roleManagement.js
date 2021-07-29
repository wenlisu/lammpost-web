// 角色管理
import api from 'util/axios'

// 角色管理 - 新增角色
export const addRole = ({ remark, roleCode, roleDescribe, roleName }) => {
  const data = {
    remark, //  备注
    roleCode, //  角色编码
    roleDescribe, // 角色描述
    roleName // 角色名称
  }

  return api.request({
    method: 'post',
    url: '/api/adminUser/addRole',
    data
  })
}

// 角色管理 - 删除角色
export const deleteRole = ({ id }) => {
  return api.request({
    method: 'delete',
    url: `/api/adminUser/deleteRole/${id}`
  })
}

// 角色管理 - 根据角色编码查询角色信息
export const getRoleByCode = ({ roleCode }) => {
  const data = { roleCode }// 角色编码
  return api.request({
    method: 'post',
    url: '/api/adminUser/getRoleByCode',
    data
  })
}

// 角色管理 - 更新角色
export const updateRole = ({ remark, id, roleDescribe, roleName }) => {
  const data = {
    remark, //  备注
    id, //  id
    roleDescribe, // 角色描述
    roleName // 角色名称
  }
  return api.request({
    method: 'put',
    url: '/api/adminUser/updateRole',
    data
  })
}

// 角色管理 - 禁用角色
export const disableRole = ({ id }) => {
  return api.request({
    method: 'post',
    url: `/api/adminUser/disableRole?id=${id}`
  })
}

// 角色管理 - 启用角色
export const enableRole = ({ id }) => {
  return api.request({
    method: 'post',
    url: `/api/adminUser/enableRole?id=${id}`
  })
}


// 角色管理/用户管理 - 查询所有角色
export const listAllRoles = () => {
  return api.request({
    method: 'get',
    url: '/api/adminUser/listAllRoles'
  })
}

// 角色管理 - 根据查询条件获取角色列表
export const listRolesByCondition = (data) => {
  return api.request({
    method: 'post',
    url: '/api/adminUser/listRolesByCondition',
    data: data
  })
}

// 角色管理 - 角色配置权限
export const addRolePermissions = ({ permissionsList, roleCode }) => {
  const data = {
    permissionsList, // 权限编码列表
    roleCode // 角色编码
  }
  return api.request({
    method: 'post',
    url: '/api/adminUser/addRolePermissions',
    data
  })
}


// 角色管理 - 根据角色编码查询拥有的权限
export const listPermissionsByRoleCode = (roleCode) => {
  return api.request({
    method: 'post',
    url: `/api/adminUser/listPermissionsByRoleCode?roleCode=${roleCode}`
  })
}
