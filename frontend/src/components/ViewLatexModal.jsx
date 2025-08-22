import React from 'react';

const ViewLatexModal = ({ open, onClose, latex }) => {
  if (!open) return null;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latex || '');
    } catch {}
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">LaTeX Source</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4">
          <textarea
            readOnly
            value={latex || ''}
            className="font-mono text-sm w-full h-96 bg-gray-50 rounded-lg p-3 border"
          />
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button onClick={handleCopy} disabled={!latex?.length} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Copy LaTeX</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewLatexModal; 