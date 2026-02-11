import { Shield, Mail, Phone, Trash2, ChevronRight, ExternalLink, Lock, Eye, Database, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface PrivacySettingsProps {
  userId: string;
  userEmail: string;
  userPhone: string;
  onClose: () => void;
  language: 'en' | 'sw';
}

/**
 * Privacy Settings & Account Deletion
 * Required by Apple App Store Guidelines
 */
export function PrivacySettings({ userId, userEmail, userPhone, onClose, language }: PrivacySettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const t = {
    en: {
      title: 'Privacy & Data',
      subtitle: 'Manage your data and privacy settings',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      dataCollection: 'Data We Collect',
      dataCollectionDesc: 'We collect farm data, crop photos, and location to provide personalized agricultural advice.',
      dataUsage: 'How We Use Your Data',
      dataUsageDesc: 'Your data trains our AI models to give you better recommendations. Your personal information is never sold.',
      dataSharing: 'Data Sharing',
      dataSharingDesc: 'We only share anonymized agricultural data with research institutions to improve farming in Tanzania.',
      yourRights: 'Your Rights',
      yourRightsDesc: 'You have the right to access, correct, or delete your data at any time.',
      deleteAccount: 'Delete Account',
      deleteAccountWarning: 'This will permanently delete your account and all associated data.',
      deleteConfirmTitle: 'Are you absolutely sure?',
      deleteConfirmDesc: 'This action cannot be undone. All your farm plans, crop data, and AI history will be permanently deleted.',
      deleteConfirmPlaceholder: 'Type "DELETE" to confirm',
      deleteConfirmButton: 'Permanently Delete Account',
      cancel: 'Cancel',
      contactSupport: 'Contact Support',
      contactSupportDesc: 'Questions about your data? Contact us at',
    },
    sw: {
      title: 'Faragha na Data',
      subtitle: 'Dhibiti data yako na mipangilio ya faragha',
      privacyPolicy: 'Sera ya Faragha',
      termsOfService: 'Masharti ya Huduma',
      dataCollection: 'Data Tunazokusanya',
      dataCollectionDesc: 'Tunakusanya data za shamba, picha za mazao, na eneo kukupa ushauri wa kilimo ulioboreshwa.',
      dataUsage: 'Jinsi Tunavyotumia Data Yako',
      dataUsageDesc: 'Data yako inafunza mifano yetu ya AI kukupa mapendekezo bora. Taarifa zako binafsi hazituzwi kamwe.',
      dataSharing: 'Kushiriki Data',
      dataSharingDesc: 'Tunashiriki tu data za kilimo zilizofichwa na taasisi za utafiti kuboresha kilimo Tanzania.',
      yourRights: 'Haki Zako',
      yourRightsDesc: 'Una haki ya kufikia, kusahihisha, au kufuta data yako wakati wowote.',
      deleteAccount: 'Futa Akaunti',
      deleteAccountWarning: 'Hii itafuta akaunti yako na data zote kwa kudumu.',
      deleteConfirmTitle: 'Je, una uhakika kabisa?',
      deleteConfirmDesc: 'Hatua hii haiwezi kutendeka. Mipango yako yote ya shamba, data za mazao, na historia ya AI itafutwa kabisa.',
      deleteConfirmPlaceholder: 'Andika "DELETE" kuhakikisha',
      deleteConfirmButton: 'Futa Akaunti kwa Kudumu',
      cancel: 'Ghairi',
      contactSupport: 'Wasiliana na Msaada',
      contactSupportDesc: 'Una maswali kuhusu data yako? Wasiliana nasi kwa',
    }
  };

  const content = t[language];

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toUpperCase() !== 'DELETE') {
      toast.error(language === 'en' ? 'Please type DELETE to confirm' : 'Tafadhali andika DELETE kuhakikisha');
      return;
    }

    setIsDeleting(true);

    try {
      // Call delete account API
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success(language === 'en' ? 'Account deleted successfully' : 'Akaunti imefutwa');
        // Log out and redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(language === 'en' ? 'Failed to delete account. Please contact support.' : 'Imeshindwa kufuta akaunti. Tafadhali wasiliana na msaada.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {content.deleteConfirmTitle}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            {content.deleteConfirmDesc}
          </p>

          {/* Confirmation Input */}
          <div className="mb-6">
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={content.deleteConfirmPlaceholder}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || deleteConfirmText.toUpperCase() !== 'DELETE'}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (language === 'en' ? 'Deleting...' : 'Inafuta...') : content.deleteConfirmButton}
            </button>

            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              {content.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{content.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-500">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Links */}
          <div className="space-y-3">
            <a
              href="https://kilimo.tz/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#2E7D32]" />
                <span className="font-semibold text-gray-900">{content.privacyPolicy}</span>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>

            <a
              href="https://kilimo.tz/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#2E7D32]" />
                <span className="font-semibold text-gray-900">{content.termsOfService}</span>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </a>
          </div>

          {/* Data Collection */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{content.dataCollection}</h3>
                <p className="text-sm text-gray-600">{content.dataCollectionDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <Eye className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{content.dataUsage}</h3>
                <p className="text-sm text-gray-600">{content.dataUsageDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Users className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{content.dataSharing}</h3>
                <p className="text-sm text-gray-600">{content.dataSharingDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{content.yourRights}</h3>
                <p className="text-sm text-gray-600">{content.yourRightsDesc}</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">{content.contactSupport}</h3>
            <p className="text-sm text-gray-600 mb-3">{content.contactSupportDesc}</p>
            <div className="space-y-2">
              <a href="mailto:privacy@kilimo.tz" className="flex items-center gap-2 text-[#2E7D32] font-semibold">
                <Mail className="w-4 h-4" />
                privacy@kilimo.tz
              </a>
              <a href="tel:+255700000000" className="flex items-center gap-2 text-[#2E7D32] font-semibold">
                <Phone className="w-4 h-4" />
                +255 700 000 000
              </a>
            </div>
          </div>

          {/* Delete Account - Danger Zone */}
          <div className="border-t-2 border-red-200 pt-6">
            <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                {content.deleteAccount}
              </h3>
              <p className="text-sm text-red-700 mb-4">{content.deleteAccountWarning}</p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                {content.deleteAccount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
