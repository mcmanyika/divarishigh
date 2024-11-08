import React from 'react'
import ApplicantsList from '../../../app/components/student/enroll/ApplicantsList'
import AdminLayout from '../../admin/adminLayout'

export default function index() {
  return (
    <AdminLayout>
        <ApplicantsList />
    </AdminLayout>
  )
}
