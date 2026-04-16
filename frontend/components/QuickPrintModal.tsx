import React, { useState, useMemo } from 'react';
import { X, Copy, Printer, Paperclip } from 'lucide-react';

interface QuickPrintModalProps {
  open: boolean;
  onClose: () => void;
  type: 'photocopy' | 'printing';
  pricePerPage: number;
  currency: string;
  staplePrice?: number;
  onConfirm: (quantity: number, pages: number, total: number, type: 'photocopy' | 'printing', pinningCost?: number, pinningCount?: number) => void;
  pinningItem?: {
    costPerUnit: number;
    conversionRate: number;
    materialId?: string;
  } | null;
}

const QuickPrintModal: React.FC<QuickPrintModalProps> = ({
  open,
  onClose,
  type,
  pricePerPage,
  currency,
  onConfirm,
  pinningItem,
  staplePrice
}) => {
  const [quantity, setQuantity] = useState(1);
  const [pagesPerCopy, setPagesPerCopy] = useState(1);
  const [enablePinning, setEnablePinning] = useState(false);
  const [pinningCount, setPinningCount] = useState(1);

  const totalPages = quantity * pagesPerCopy;
  const printTotal = totalPages * pricePerPage;

  const pinningCost = useMemo(() => {
    if (!enablePinning) return 0;
    // If a staple price is provided in settings, prefer that (price per staple)
    if (typeof staplePrice === 'number' && staplePrice > 0) {
      return Number((pinningCount * staplePrice).toFixed(2));
    }
    if (!pinningItem || pinningItem.conversionRate <= 0) return 0;
    const unitsNeeded = Math.ceil(pinningCount / pinningItem.conversionRate);
    return Number((unitsNeeded * pinningItem.costPerUnit).toFixed(2));
  }, [enablePinning, pinningItem, pinningCount, staplePrice]);

  const finalTotal = printTotal + pinningCost;

  const handleConfirm = () => {
    onConfirm(quantity, pagesPerCopy, finalTotal, type, enablePinning ? pinningCost : undefined, enablePinning ? pinningCount : undefined);
    setQuantity(1);
    setPagesPerCopy(1);
    setEnablePinning(false);
    setPinningCount(1);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="app-modal fixed inset-0 z-50 flex items-center justify-center p-4 font-sans" style={{ fontFamily: 'Inter, Roboto, system-ui, sans-serif' }}>
      <div
        className="absolute inset-0 bg-slate-800/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="modal-content relative rounded-[1.25rem] shadow-2xl w-full max-w-md overflow-hidden bg-white">
        <div className="modal-header flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${type === 'photocopy' ? 'bg-slate-100' : 'bg-blue-100'}`}>
              {type === 'photocopy' ? (
                <Copy className="w-5 h-5 text-slate-600" />
              ) : (
                <Printer className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="modal-title text-[22px] font-bold leading-snug text-slate-800">
                {type === 'photocopy' ? 'Quick Photocopy' : 'Type & Printing'}
              </h2>
              <p className="modal-sub text-[12.5px] font-medium text-slate-500 leading-tight">
                {currency}{pricePerPage} per page
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="modal-label block text-[12.5px] font-semibold text-slate-700 mb-1.5 leading-tight">
              Number of Copies
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-[7px] border border-slate-200 rounded-lg text-slate-800 font-medium text-[13.5px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 tabular-nums"
            />
          </div>

          <div>
            <label className="modal-label block text-[12.5px] font-semibold text-slate-700 mb-1.5 leading-tight">
              Pages per Copy
            </label>
            <input
              type="number"
              min={1}
              value={pagesPerCopy}
              onChange={(e) => setPagesPerCopy(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-[7px] border border-slate-200 rounded-lg text-slate-800 font-medium text-[13.5px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 tabular-nums"
            />
          </div>

          {(pinningItem || (typeof staplePrice === 'number')) && (
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-500" />
                  <span className="text-[12.5px] font-semibold text-slate-700">Pinning / Stapling</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnablePinning(!enablePinning)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${enablePinning ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enablePinning ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              {enablePinning && (
                <div>
                  <label className="modal-label-small block text-[11.5px] font-medium text-slate-500 mb-1 leading-tight">Number of Staples</label>
                  <input
                    type="number"
                    min={1}
                    value={pinningCount}
                    onChange={(e) => setPinningCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-[6px] border border-slate-200 rounded-md text-slate-800 font-medium text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 tabular-nums"
                  />
                  <p className="text-[11.5px] text-slate-400 mt-1 leading-tight">
                    {typeof staplePrice === 'number' && staplePrice > 0
                      ? `${currency}${staplePrice} per staple`
                      : (pinningItem ? `${currency}${pinningItem.costPerUnit} per ${pinningItem.conversionRate} staples` : '')}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="p-3 bg-slate-50/80 rounded-lg space-y-1.5" style={{ lineHeight: '1.45' }}>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-slate-600">Total Pages:</span>
              <span className="font-semibold text-slate-800 tabular-nums text-right">{totalPages}</span>
            </div>
            {enablePinning && pinningCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-slate-600">Pinning ({pinningCount} staples):</span>
                <span className="font-semibold text-slate-800 tabular-nums text-right">{currency}{pinningCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="font-semibold text-slate-700" style={{ fontSize: '13.5px' }}>Total:</span>
              <span className="font-bold text-emerald-600 tabular-nums text-right" style={{ fontSize: '18px' }}>
                {currency}{finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer flex gap-3 p-3 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="modal-btn-secondary flex-1 font-semibold text-slate-600 hover:text-slate-800 transition-colors py-[7px] px-3 rounded-lg text-[13px]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="modal-btn-primary flex-1 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors py-[7px] px-3 text-[13px]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPrintModal;