'use client';

import React from 'react';

export function NutritionModal({ isOpen, itemId, itemName, onClose }) {
  if (!isOpen || !itemId) return null;

  const nutritionData = typeof window !== 'undefined' ? window.NUTRITION_DATA?.[itemId] : null;
  const nutritionImage = `/nutrition-info/${itemId}.jpeg`;

  const hasData = nutritionData && (nutritionData.composition || nutritionData.values?.length > 0);

  if (!hasData) {
    return (
      <div className="nutrition-modal-overlay" onClick={onClose}>
        <div className="nutrition-modal nutrition-modal-image-only" onClick={(e) => e.stopPropagation()}>
          <button className="nutrition-modal-close" onClick={onClose}>✕</button>
          <div className="nutrition-modal-content">
            <h2 className="nutrition-modal-title">{itemName}</h2>
            <img src={nutritionImage} alt={itemName} className="nutrition-full-image" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrition-modal-overlay" onClick={onClose}>
      <div className="nutrition-modal" onClick={(e) => e.stopPropagation()}>
        <button className="nutrition-modal-close" onClick={onClose}>✕</button>

        <div className="nutrition-modal-content">
          <h2 className="nutrition-modal-title">{itemName}</h2>

          {nutritionData.origin && (
            <div className="nutrition-section">
              <h3>Krajina pôvodu</h3>
              <p>{nutritionData.origin}</p>
            </div>
          )}

          {nutritionData.composition && (
            <div className="nutrition-section">
              <h3>Zloženie</h3>
              <p>{nutritionData.composition}</p>
            </div>
          )}

          {nutritionData.values && nutritionData.values.length > 0 && (
            <div className="nutrition-section">
              <h3>Výživové údaje na 100g</h3>
              <table className="nutrition-table">
                <tbody>
                  {nutritionData.values.map((row, idx) => (
                    <tr key={idx}>
                      <td className="nutrition-label">{row.label}</td>
                      <td className="nutrition-value">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {nutritionData.storage && (
            <div className="nutrition-section nutrition-storage">
              <h3>Skladovanie</h3>
              <p>{nutritionData.storage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
