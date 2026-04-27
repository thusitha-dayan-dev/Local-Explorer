import React from 'react';
import { adminResetPassword, adminUpdatePassword } from '@/lib/utils';
import PageSider from '@/pages/web/Auth/components/PageSider';
import AdminUpdatePasswordForm from './components/AdminUpdatePasswordForm';

const ResetPassword = ({ token, email }: any) => {
    return (
        <main className="form_layout_main">
            <PageSider signupPageData={adminUpdatePassword} />
            <AdminUpdatePasswordForm email={email} token={token} />
        </main>
    );
};

export default ResetPassword;
