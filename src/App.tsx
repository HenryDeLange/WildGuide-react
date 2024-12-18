
import { memo } from 'react';
import './App.css';
import { ChangeLanguage } from './i18n/ChangeLanguage';

export const App = memo(() => {

    return (
        <>
            <p>stuff</p>
            <ChangeLanguage />
        </>
    );
});
