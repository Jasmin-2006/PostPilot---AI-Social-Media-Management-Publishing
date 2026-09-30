import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SocialAccount, SocialPlatform } from '../types';
import { PlatformIcon, getPlatformMeta } from './PlatformIcon';
import { X, CheckCircle2, ShieldCheck, Key, RefreshCw, Unlink, ExternalLink } from 'lucide-react';

interface IntegrationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformToConfigure?: SocialPlatform;
}

export const IntegrationSetupModal: React.FC<IntegrationSetupModalProps> = ({
  isOpen,
  onClose,
  platformToConfigure = 'instagram',
}) => {
  const { accounts, connectAccount, disconnectAccount, addToast } = useApp();
  const [selectedPlat, setSelectedPlat] = useState<SocialPlatform>(platformToConfigure);
  const [customHandle, setCustomHandle] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const currentAccount = accounts.find(a => a.platform === selectedPlat) || {
    id: `acc_${selectedPlat}`,
    platform: selectedPlat,
    platformName: getPlatformMeta(selectedPlat).name,
    isConnected: false,
    accountHandle: 'Not connected',
    accountName: '',
  };

  const meta = getPlatformMeta(selectedPlat);

  const handleSimulateOAuth = async () => {
    setIsAuthorizing(true);
    await new Promise(r => setTimeout(r, 700));
    setIsAuthorizing(false);
    connectAccount(selectedPlat, customHandle || undefined);
    setCustomHandle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${meta.bgLight} ${meta.color} border ${meta.border}`}>
              <PlatformIcon platform={selectedPlat} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                {meta.name} Integration
              </h3>
              <p className="text-[11px] text-stone-500">
                Official API & OAuth 2.0 Credentials
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selector */}
        <div className="px-6 py-2.5 bg-stone-100/60 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          {accounts.map(acc => {
            const isSel = acc.platform === selectedPlat;
            const pMeta = getPlatformMeta(acc.platform);
            return (
              <button
                key={acc.platform}
                onClick={() => setSelectedPlat(acc.platform)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSel
                    ? 'bg-white text-stone-950 shadow-sm border border-stone-300 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <PlatformIcon platform={acc.platform} className="w-3.5 h-3.5" />
                <span>{pMeta.name}</span>
                {acc.isConnected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            currentAccount.isConnected 
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
              : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${currentAccount.isConnected ? 'bg-emerald-500' : 'bg-stone-400'}`} />
              <div>
                <p className="text-xs font-bold">
                  {currentAccount.isConnected ? 'Account Active & Connected' : 'Not Connected'}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {currentAccount.isConnected 
                    ? `Linked to handle: ${currentAccount.accountHandle}` 
                    : 'OAuth token required for programmatic publishing.'}
                </p>
              </div>
            </div>

            {currentAccount.isConnected ? (
              <button
                onClick={() => disconnectAccount(selectedPlat)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100/70 border border-rose-200 rounded-lg transition-colors font-medium"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : null}
          </div>

          {/* Configuration Form */}
          {!currentAccount.isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Profile Handle / Vanity URL
                </label>
                <input
                  type="text"
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  placeholder={`e.g. @mychannel or username`}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Modular API Architecture</span>
                </div>
                <p>
                  PostPilot connects via official developer APIs. In production or sandbox mode, grants granular write access without exposing passwords.
                </p>
                <div className="font-mono text-[10px] text-stone-500 bg-white p-2 rounded border border-stone-200">
                  Scopes: {selectedPlat === 'instagram' ? 'instagram_content_publish, pages_read_engagement' :
                           selectedPlat === 'linkedin' ? 'w_member_social, r_liteprofile' :
                           selectedPlat === 'twitter' ? 'tweet.read, tweet.write, users.read' :
                           selectedPlat === 'youtube' ? 'youtube.upload, youtube.readonly' : 'pages_manage_posts'}
                </div>
              </div>

              <button
                onClick={handleSimulateOAuth}
                disabled={isAuthorizing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {isAuthorizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting OAuth 2.0...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Authorize & Link {meta.name} Account</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-500">
                  <span>API Protocol:</span>
                  <span className="font-mono font-medium text-stone-800">OAuth 2.0 PKCE</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Last Sync Status:</span>
                  <span className="font-medium text-emerald-700">Healthy (200 OK)</span>
                </div>
                <div className="flex items-center justify-between text-stone-500">
                  <span>Connected At:</span>
                  <span className="font-mono text-[11px] text-stone-700">
                    {currentAccount.connectedAt ? new Date(currentAccount.connectedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => addToast('API Token Refreshed', `Active token refreshed for ${meta.name}`, 'success')}
                  className="flex-1 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Refresh Token
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
