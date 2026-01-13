function TacticsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">전술 목록</h3>
        <button className="w-full btn-primary text-sm mb-3">새 전술</button>
        <div className="bg-gray-700 p-3 rounded">
          <p className="text-xs text-gray-400">전술이 없습니다</p>
        </div>
      </div>
    </div>
  );
}

export default TacticsTab;
