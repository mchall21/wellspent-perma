"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkTableStructure();
  }, []);

  async function checkTableStructure() {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check assessment_responses table structure
      const { data: columnInfo, error: columnError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'assessment_responses')
        .eq('table_schema', 'public');
      
      if (columnError) {
        console.error("Column info error:", columnError);
        setError(`Column info error: ${columnError.message || JSON.stringify(columnError)}`);
        return;
      }
      
      // Check assessment_results table structure
      const { data: resultsColumnInfo, error: resultsColumnError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'assessment_results')
        .eq('table_schema', 'public');
      
      if (resultsColumnError) {
        console.error("Results column info error:", resultsColumnError);
      }
      
      // Check for required columns
      const hasPersonalValueColumn = columnInfo?.some(col => col.column_name === 'personal_response_value');
      const hasWorkValueColumn = columnInfo?.some(col => col.column_name === 'work_response_value');
      
      // Check for assessment_results columns
      const hasResultsCategoryColumn = resultsColumnInfo?.some(col => col.column_name === 'category');
      const hasResultsContextColumn = resultsColumnInfo?.some(col => col.column_name === 'context');
      
      // Get a sample row from assessment_responses
      const { data: sampleData, error: sampleError } = await supabase
        .from('assessment_responses')
        .select('*')
        .limit(5);
      
      if (sampleError) {
        console.error("Error fetching sample data:", sampleError);
        setError(`Sample data error: ${sampleError.message || JSON.stringify(sampleError)}`);
        return;
      }
      
      // Get a sample row from assessment_results
      const { data: resultsSampleData, error: resultsSampleError } = await supabase
        .from('assessment_results')
        .select('*')
        .limit(5);
      
      if (resultsSampleError) {
        console.error("Error fetching results sample data:", resultsSampleError);
      }
      
      setTableInfo({
        columns: columnInfo || [],
        resultsColumns: resultsColumnInfo || [],
        hasPersonalValueColumn,
        hasWorkValueColumn,
        hasResultsCategoryColumn,
        hasResultsContextColumn,
        sample: sampleData || [],
        resultsSample: resultsSampleData || [],
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error checking table structure:", error);
      setError(`Error checking table structure: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Database Debug</h1>
          <Button onClick={checkTableStructure} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {tableInfo && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-medium">assessment_responses Table:</h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">personal_response_value Column:</span>
                      <span className={tableInfo.hasPersonalValueColumn ? "text-green-600" : "text-red-600"}>
                        {tableInfo.hasPersonalValueColumn ? "Present" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">work_response_value Column:</span>
                      <span className={tableInfo.hasWorkValueColumn ? "text-green-600" : "text-red-600"}>
                        {tableInfo.hasWorkValueColumn ? "Present" : "Missing"}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">assessment_results Table:</h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">category Column:</span>
                      <span className={tableInfo.hasResultsCategoryColumn ? "text-green-600" : "text-red-600"}>
                        {tableInfo.hasResultsCategoryColumn ? "Present" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">context Column:</span>
                      <span className={tableInfo.hasResultsContextColumn ? "text-green-600" : "text-red-600"}>
                        {tableInfo.hasResultsContextColumn ? "Present" : "Missing"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          {tableInfo.hasPersonalValueColumn && tableInfo.hasWorkValueColumn 
                            ? "Your assessment_responses table has the correct structure with personal_response_value and work_response_value columns." 
                            : "Your assessment_responses table is missing one or both of the required columns."}
                          {tableInfo.hasResultsCategoryColumn && tableInfo.hasResultsContextColumn
                            ? " Your assessment_results table has the correct structure with category and context columns."
                            : " Your assessment_results table is missing one or both of the required columns."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">assessment_responses Columns:</h3>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Column Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nullable
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tableInfo.columns.map((column: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {column.column_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {column.data_type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {column.is_nullable}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sample Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">assessment_responses ({tableInfo.sample.length} rows):</h3>
                    {tableInfo.sample.length > 0 ? (
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        {JSON.stringify(tableInfo.sample, null, 2)}
                      </pre>
                    ) : (
                      <p>No data found in the assessment_responses table.</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">assessment_results ({tableInfo.resultsSample?.length || 0} rows):</h3>
                    {tableInfo.resultsSample && tableInfo.resultsSample.length > 0 ? (
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        {JSON.stringify(tableInfo.resultsSample, null, 2)}
                      </pre>
                    ) : (
                      <p>No data found in the assessment_results table.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
} 